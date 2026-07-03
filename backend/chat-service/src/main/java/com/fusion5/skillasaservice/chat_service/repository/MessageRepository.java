package com.fusion5.skillasaservice.chat_service.repository;
import com.fusion5.skillasaservice.chat_service.entity.Message;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
public interface MessageRepository extends JpaRepository<Message, Long> {
    Page<Message> findByRoomIdAndDeletedFalseOrderBySentAtDesc(Long roomId, Pageable pageable);
}
