package com.fusion5.skillasaservice.chat_service.controller;

import com.fusion5.skillasaservice.chat_service.dto.payload.ChatMessagePayload;
import com.fusion5.skillasaservice.chat_service.dto.payload.TypingPayload;
import com.fusion5.skillasaservice.chat_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.chat_service.entity.Message;
import com.fusion5.skillasaservice.chat_service.repository.AuthUserRefRepository;
import com.fusion5.skillasaservice.chat_service.service.MessageService;
import com.fusion5.skillasaservice.chat_service.service.OnlineStatusService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Controller;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Map;

@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatWebSocketController {

    private final SimpMessagingTemplate  messagingTemplate;
    private final MessageService         messageService;
    private final OnlineStatusService    onlineStatusService;
    private final AuthUserRefRepository  authUserRefRepository;

    // ── Online status events ──────────────────────────────────────────────────

    @EventListener
    public void onConnect(SessionConnectedEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        if (sha.getUser() != null) {
            Long userId = resolveUserId(sha.getUser().getName());
            if (userId != null) {
                onlineStatusService.setOnline(userId);
                broadcastStatus(userId, true);
                log.debug("User {} connected", userId);
            }
        }
    }

    @EventListener
    public void onDisconnect(SessionDisconnectEvent event) {
        StompHeaderAccessor sha = StompHeaderAccessor.wrap(event.getMessage());
        if (sha.getUser() != null) {
            Long userId = resolveUserId(sha.getUser().getName());
            if (userId != null) {
                onlineStatusService.setOffline(userId);
                broadcastStatus(userId, false);
                log.debug("User {} disconnected", userId);
            }
        }
    }

    // ── Heartbeat: keeps online status TTL alive ──────────────────────────────
    // Frontend sends to /app/user.heartbeat every 30 seconds
    @MessageMapping("/user.heartbeat")
    public void heartbeat(Principal principal) {
        Long userId = resolveUserId(principal.getName());
        if (userId != null) {
            onlineStatusService.setOnline(userId);
        }
    }

    // ── Send message: /app/chat.send ──────────────────────────────────────────
    // Frontend STOMP send: { roomId, content }
    // Broadcasts saved message to /topic/room.{roomId}
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessagePayload payload, Principal principal) {
        try {
            Message saved = messageService.save(payload.getRoomId(), payload.getContent());
            messagingTemplate.convertAndSend("/topic/room." + payload.getRoomId(), saved);
            log.debug("Message {} sent to room {}", saved.getId(), payload.getRoomId());
        } catch (Exception e) {
            log.warn("sendMessage failed for room {}: {}", payload.getRoomId(), e.getMessage());
            // Send error back to sender
            if (principal != null) {
                messagingTemplate.convertAndSendToUser(
                        principal.getName(), "/queue/errors",
                        Map.of("error", e.getMessage(), "roomId", payload.getRoomId()));
            }
        }
    }

    // ── Typing indicator: /app/chat.typing ───────────────────────────────────
    // Frontend STOMP send: { roomId, typing: true/false }
    // Broadcasts to /topic/room.{roomId}.typing (all room members see it)
    @MessageMapping("/chat.typing")
    public void typingIndicator(@Payload TypingPayload payload, Principal principal) {
        if (principal == null) return;
        Long userId = resolveUserId(principal.getName());
        Map<String, Object> event = Map.of(
                "userId", userId != null ? userId : 0,
                "typing", payload.isTyping()
        );
        messagingTemplate.convertAndSend("/topic/room." + payload.getRoomId() + ".typing", event);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────

    private Long resolveUserId(String uuid) {
        return authUserRefRepository.findByUuid(uuid)
                .map(AuthUserRef::getId).orElse(null);
    }

    private void broadcastStatus(Long userId, boolean online) {
        messagingTemplate.convertAndSend("/topic/user." + userId + ".status",
                Map.of("userId", userId, "online", online));
    }
}
