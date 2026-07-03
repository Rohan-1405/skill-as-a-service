package com.fusion5.skillasaservice.chat_service.controller;

import com.fusion5.skillasaservice.chat_service.dto.request.CreatePrivateRoomRequest;
import com.fusion5.skillasaservice.chat_service.dto.request.CreateRoomRequest;
import com.fusion5.skillasaservice.chat_service.dto.request.SendAttachmentRequest;
import com.fusion5.skillasaservice.chat_service.dto.request.SendMessageRequest;
import com.fusion5.skillasaservice.chat_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.chat_service.entity.ChatMember;
import com.fusion5.skillasaservice.chat_service.entity.ChatRoom;
import com.fusion5.skillasaservice.chat_service.entity.Message;
import com.fusion5.skillasaservice.chat_service.service.ChatRoomService;
import com.fusion5.skillasaservice.chat_service.service.MessageService;
import com.fusion5.skillasaservice.chat_service.service.OnlineStatusService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatRoomController {

    private final ChatRoomService    chatRoomService;
    private final MessageService     messageService;
    private final OnlineStatusService onlineStatusService;
    private final SimpMessagingTemplate messagingTemplate;

    // ── Chat rooms ────────────────────────────────────────────────────────────

    /** GET /api/chat/rooms — list all rooms I'm a member of */
    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<List<ChatRoom>>> myRooms() {
        return ResponseEntity.ok(ApiResponse.success("OK", chatRoomService.myRooms()));
    }

    /** POST /api/chat/rooms/private — get or create private room with another user.
     *  Validates ACTIVE subscription exists between caller and otherUserId. */
    @PostMapping("/rooms/private")
    public ResponseEntity<ApiResponse<ChatRoom>> createPrivateRoom(
            @Valid @RequestBody CreatePrivateRoomRequest request) {
        ChatRoom room = chatRoomService.getOrCreatePrivateRoom(request.getOtherUserId());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Room ready", room));
    }

    /** POST /api/chat/rooms — generic create: roomType=PRIVATE (needs otherUserId) or GROUP (needs name + memberUserIds).
     *  Project-linked group rooms are still auto-created via the team-created event; this is for manual/ad-hoc groups. */
    @PostMapping("/rooms")
    public ResponseEntity<ApiResponse<ChatRoom>> createRoom(@Valid @RequestBody CreateRoomRequest request) {
        ChatRoom room = chatRoomService.createRoom(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Room ready", room));
    }

    /** GET /api/chat/rooms/{id}/members — list members of a room */
    @GetMapping("/rooms/{id}/members")
    public ResponseEntity<ApiResponse<List<ChatMember>>> getMembers(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", chatRoomService.getMembers(id)));
    }

    // ── Message history (REST fallback — WebSocket is primary for real-time) ──

    /** GET /api/chat/rooms/{id}/messages?page=0&size=30 — paginated history (newest first) */
    @GetMapping("/rooms/{id}/messages")
    public ResponseEntity<ApiResponse<Page<Message>>> getHistory(
            @PathVariable Long id,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "30") int size) {
        Page<Message> history = messageService.getHistory(id,
                PageRequest.of(page, size, Sort.by("sentAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("OK", history));
    }

    /** DELETE /api/chat/messages/{id} — soft-delete own message */
    @DeleteMapping("/messages/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        messageService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted", null));
    }

    /** POST /api/chat/rooms/{id}/messages — REST fallback to send (WebSocket /app/chat.send is primary).
     *  Also broadcasts to /topic/room.{id} so WS-connected clients see it live. */
    @PostMapping("/rooms/{id}/messages")
    public ResponseEntity<ApiResponse<Message>> sendMessageRest(
            @PathVariable Long id, @Valid @RequestBody SendMessageRequest request) {
        Message saved = messageService.save(id, request.getContent());
        messagingTemplate.convertAndSend("/topic/room." + id, saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Message sent", saved));
    }

    /** POST /api/chat/rooms/{id}/attachments — attach an already-hosted file (URL) to the room.
     *  NOTE: this does not accept binary uploads. The client must upload the file elsewhere first
     *  (e.g. a presigned S3/Wasabi URL) and pass the resulting URL here. Direct upload support
     *  depends on cloud-storage-service, which is not built yet (Phase 2 backlog). */
    @PostMapping("/rooms/{id}/attachments")
    public ResponseEntity<ApiResponse<Message>> sendAttachment(
            @PathVariable Long id, @Valid @RequestBody SendAttachmentRequest request) {
        Message saved = messageService.saveAttachment(
                id, request.getAttachmentUrl(), request.getAttachmentName(), request.getAttachmentType());
        messagingTemplate.convertAndSend("/topic/room." + id, saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Attachment sent", saved));
    }

    /** PATCH /api/chat/messages/{id}/read — mark this message (and everything before it) as read by caller. */
    @PatchMapping("/messages/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markRead(@PathVariable Long id) {
        Message msg = messageService.getById(id);
        chatRoomService.markRead(id, msg.getRoomId());
        return ResponseEntity.ok(ApiResponse.success("Marked read", null));
    }

    // ── Online status ─────────────────────────────────────────────────────────

    /** GET /api/chat/users/{userId}/online — check if a user is currently online */
    @GetMapping("/users/{userId}/online")
    public ResponseEntity<ApiResponse<Map<String,Boolean>>> isOnline(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                Map.of("online", onlineStatusService.isOnline(userId))));
    }
}
