package com.fusion5.skillasaservice.chat_service.repository;
import com.fusion5.skillasaservice.chat_service.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {
    Optional<ChatRoom> findBySubscriptionId(Long subscriptionId);
    Optional<ChatRoom> findByProjectId(Long projectId);
}
