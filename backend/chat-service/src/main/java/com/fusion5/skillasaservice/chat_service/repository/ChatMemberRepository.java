package com.fusion5.skillasaservice.chat_service.repository;
import com.fusion5.skillasaservice.chat_service.entity.ChatMember;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;
public interface ChatMemberRepository extends JpaRepository<ChatMember, Long> {
    List<ChatMember> findByUserId(Long userId);
    List<ChatMember> findByRoomId(Long roomId);
    Optional<ChatMember> findByRoomIdAndUserId(Long roomId, Long userId);
    boolean existsByRoomIdAndUserId(Long roomId, Long userId);
}
