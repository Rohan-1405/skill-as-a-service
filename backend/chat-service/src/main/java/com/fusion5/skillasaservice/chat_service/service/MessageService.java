package com.fusion5.skillasaservice.chat_service.service;

import com.fusion5.skillasaservice.chat_service.entity.Message;
import com.fusion5.skillasaservice.chat_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.chat_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.chat_service.repository.MessageRepository;
import com.fusion5.skillasaservice.chat_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository   messageRepository;
    private final ChatRoomService     chatRoomService;
    private final CurrentUserResolver currentUserResolver;

    /** Save message — validates send permission (membership + active subscription). */
    @Transactional
    public Message save(Long roomId, String content) {
        chatRoomService.requireCanSend(roomId);
        Long senderId = currentUserResolver.getCurrentUserId();
        Message msg = new Message();
        msg.setRoomId(roomId);
        msg.setSenderId(senderId);
        msg.setContent(content.trim());
        return messageRepository.save(msg);
    }

    /** Load message history — caller must be a member. After sub cancel: still allowed (read-only). */
    public Page<Message> getHistory(Long roomId, Pageable pageable) {
        chatRoomService.requireMembership(roomId);
        return messageRepository.findByRoomIdAndDeletedFalseOrderBySentAtDesc(roomId, pageable);
    }

    /** Fetch a message by id — used to resolve its roomId (e.g. for read receipts). */
    public Message getById(Long messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + messageId));
    }

    /** Save an attachment message (URL must already point to a hosted file — no binary upload here). */
    @Transactional
    public Message saveAttachment(Long roomId, String url, String name, String type) {
        chatRoomService.requireCanSend(roomId);
        Long senderId = currentUserResolver.getCurrentUserId();
        Message msg = new Message();
        msg.setRoomId(roomId);
        msg.setSenderId(senderId);
        msg.setContent(name != null && !name.isBlank() ? name : "[attachment]");
        msg.setAttachmentUrl(url);
        msg.setAttachmentName(name);
        msg.setAttachmentType(type);
        return messageRepository.save(msg);
    }

    /** Soft-delete a message — only sender can delete. */
    @Transactional
    public void delete(Long messageId) {
        Long userId = currentUserResolver.getCurrentUserId();
        Message msg = messageRepository.findById(messageId)
                .orElseThrow(() -> new ResourceNotFoundException("Message not found: " + messageId));
        if (!msg.getSenderId().equals(userId)) {
            throw new ForbiddenException("You can only delete your own messages");
        }
        msg.setDeleted(true);
        messageRepository.save(msg);
    }
}
