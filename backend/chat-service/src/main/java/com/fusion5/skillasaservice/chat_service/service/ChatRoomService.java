package com.fusion5.skillasaservice.chat_service.service;

import com.fusion5.skillasaservice.chat_service.dto.request.CreateRoomRequest;
import com.fusion5.skillasaservice.chat_service.entity.*;
import com.fusion5.skillasaservice.chat_service.entity.SubscriptionRef.SubscriptionStatus;
import com.fusion5.skillasaservice.chat_service.exception.BadRequestException;
import com.fusion5.skillasaservice.chat_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.chat_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.chat_service.repository.*;
import com.fusion5.skillasaservice.chat_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatRoomService {

    private final ChatRoomRepository     chatRoomRepository;
    private final ChatMemberRepository   chatMemberRepository;
    private final SubscriptionRefRepository subscriptionRefRepository;
    private final AuthUserRefRepository  authUserRefRepository;
    private final CurrentUserResolver    currentUserResolver;

    /** Create or return existing private room between caller and otherUserId.
     *  Validates that an ACTIVE subscription exists between them (either direction). */
    @Transactional
    public ChatRoom getOrCreatePrivateRoom(Long otherUserId) {
        Long callerId = currentUserResolver.getCurrentUserId();

        if (callerId.equals(otherUserId)) {
            throw new BadRequestException("You cannot start a chat with yourself");
        }

        // Verify ACTIVE subscription exists (client→freelancer or freelancer→client)
        SubscriptionRef sub = subscriptionRefRepository
                .findByClientIdAndFreelancerIdAndStatus(callerId, otherUserId, SubscriptionStatus.ACTIVE)
                .or(() -> subscriptionRefRepository
                        .findByClientIdAndFreelancerIdAndStatus(otherUserId, callerId, SubscriptionStatus.ACTIVE))
                .orElseThrow(() -> new ForbiddenException(
                        "You can only chat with freelancers you have an active subscription with"));

        // Return existing room if already created for this subscription
        return chatRoomRepository.findBySubscriptionId(sub.getId())
                .orElseGet(() -> {
                    ChatRoom room = new ChatRoom();
                    room.setRoomType(ChatRoom.RoomType.PRIVATE);
                    room.setSubscriptionId(sub.getId());
                    room.setName("Private Chat");
                    ChatRoom saved = chatRoomRepository.saveAndFlush(room);

                    // Add both participants
                    addMember(saved.getId(), callerId);
                    addMember(saved.getId(), otherUserId);

                    log.info("Private chat room {} created for subscription {}", saved.getId(), sub.getId());
                    return saved;
                });
    }

    /** Generic room creation: PRIVATE (delegates to getOrCreatePrivateRoom) or GROUP (ad-hoc, manual). */
    @Transactional
    public ChatRoom createRoom(CreateRoomRequest req) {
        if (req.getRoomType() == null) {
            throw new BadRequestException("roomType is required (PRIVATE or GROUP)");
        }
        String type = req.getRoomType().trim().toUpperCase();

        if (type.equals("PRIVATE")) {
            if (req.getOtherUserId() == null) {
                throw new BadRequestException("otherUserId is required for PRIVATE rooms");
            }
            return getOrCreatePrivateRoom(req.getOtherUserId());
        }

        if (type.equals("GROUP")) {
            Long callerId = currentUserResolver.getCurrentUserId();
            if (req.getName() == null || req.getName().isBlank()) {
                throw new BadRequestException("name is required for GROUP rooms");
            }
            if (req.getProjectId() != null && chatRoomRepository.findByProjectId(req.getProjectId()).isPresent()) {
                throw new BadRequestException("A group room already exists for project " + req.getProjectId());
            }
            ChatRoom room = new ChatRoom();
            room.setRoomType(ChatRoom.RoomType.GROUP);
            room.setName(req.getName().trim());
            room.setProjectId(req.getProjectId());
            ChatRoom saved = chatRoomRepository.saveAndFlush(room);

            addMember(saved.getId(), callerId);
            if (req.getMemberUserIds() != null) {
                for (Long uid : req.getMemberUserIds()) {
                    if (!uid.equals(callerId)) addMember(saved.getId(), uid);
                }
            }
            log.info("Ad-hoc group room {} created by {}", saved.getId(), callerId);
            return saved;
        }

        throw new BadRequestException("Invalid roomType: " + req.getRoomType() + " (expected PRIVATE or GROUP)");
    }

    /** Mark all messages up to `messageId` as read by the caller, in that message's room. */
    @Transactional
    public void markRead(Long messageId, Long roomIdOfMessage) {
        Long userId = currentUserResolver.getCurrentUserId();
        requireMembership(roomIdOfMessage);

        ChatMember member = chatMemberRepository.findByRoomIdAndUserId(roomIdOfMessage, userId)
                .orElseThrow(() -> new ForbiddenException("You are not a member of this chat room"));
        member.setLastReadMessageId(messageId);
        member.setLastReadAt(LocalDateTime.now());
        chatMemberRepository.save(member);
    }

    /** List all rooms the calling user is a member of. */
    public List<ChatRoom> myRooms() {
        Long userId = currentUserResolver.getCurrentUserId();
        return chatMemberRepository.findByUserId(userId).stream()
                .map(m -> chatRoomRepository.findById(m.getRoomId()).orElse(null))
                .filter(r -> r != null)
                .collect(Collectors.toList());
    }

    /** Get room members. Caller must be a member of the room. */
    public List<ChatMember> getMembers(Long roomId) {
        requireMembership(roomId);
        return chatMemberRepository.findByRoomId(roomId);
    }

    /** Verify caller is member AND subscription is still active (for private rooms).
     *  After subscription cancel: can READ but not SEND — call this before saving a message. */
    public void requireCanSend(Long roomId) {
        Long userId = currentUserResolver.getCurrentUserId();
        requireMembership(roomId);

        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Chat room not found: " + roomId));

        if (room.getRoomType() == ChatRoom.RoomType.PRIVATE && room.getSubscriptionId() != null) {
            SubscriptionRef sub = subscriptionRefRepository.findById(room.getSubscriptionId()).orElse(null);
            if (sub == null || sub.getStatus() != SubscriptionStatus.ACTIVE) {
                throw new ForbiddenException(
                        "Your subscription has ended. You can read past messages but cannot send new ones.");
            }
        }
    }

    public void requireMembership(Long roomId) {
        Long userId = currentUserResolver.getCurrentUserId();
        if (!chatMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            throw new ForbiddenException("You are not a member of this chat room");
        }
    }

    private void addMember(Long roomId, Long userId) {
        if (!chatMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
            ChatMember m = new ChatMember();
            m.setRoomId(roomId); m.setUserId(userId);
            chatMemberRepository.save(m);
        }
    }
}
