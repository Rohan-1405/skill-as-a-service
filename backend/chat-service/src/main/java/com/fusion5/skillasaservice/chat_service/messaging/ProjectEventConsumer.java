package com.fusion5.skillasaservice.chat_service.messaging;

import com.fusion5.skillasaservice.chat_service.entity.ChatMember;
import com.fusion5.skillasaservice.chat_service.entity.ChatRoom;
import com.fusion5.skillasaservice.chat_service.repository.ChatMemberRepository;
import com.fusion5.skillasaservice.chat_service.repository.ChatRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class ProjectEventConsumer {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMemberRepository chatMemberRepository;

    @RabbitListener(queues = "${chat.rabbitmq.queue}")
    @Transactional
    public void onTeamCreated(ProjectTeamCreatedEvent event) {
        try {
            // Idempotency: skip if room already exists for this project
            if (chatRoomRepository.findByProjectId(event.getProjectId()).isPresent()) {
                log.info("Group room already exists for project {}", event.getProjectId());
                return;
            }

            ChatRoom room = new ChatRoom();
            room.setRoomType(ChatRoom.RoomType.GROUP);
            room.setProjectId(event.getProjectId());
            room.setName(event.getProjectName() + " — Team Chat");
            room = chatRoomRepository.saveAndFlush(room);

            final Long roomId = room.getId();

            // Add all team members as chat members
            List<Long> allMembers = event.getMemberUserIds();
            if (allMembers != null) {
                for (Long userId : allMembers) {
                    if (!chatMemberRepository.existsByRoomIdAndUserId(roomId, userId)) {
                        ChatMember m = new ChatMember();
                        m.setRoomId(roomId);
                        m.setUserId(userId);
                        chatMemberRepository.save(m);
                    }
                }
            }

            log.info("Group chat room {} created for project {} with {} members",
                    roomId, event.getProjectId(), allMembers != null ? allMembers.size() : 0);

        } catch (Exception e) {
            log.error("Failed to create group chat for project {}: {}",
                    event.getProjectId(), e.getMessage());
        }
    }
}
