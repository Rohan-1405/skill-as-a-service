package com.fusion5.skillasaservice.chat_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_members",
       uniqueConstraints = @UniqueConstraint(columnNames = {"room_id","user_id"}))
@Data
public class ChatMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false) private Long roomId;
    @Column(name = "user_id", nullable = false) private Long userId;

    // Read-receipt tracking: last message this member has read, and when.
    @Column(name = "last_read_message_id") private Long lastReadMessageId;
    @Column(name = "last_read_at") private LocalDateTime lastReadAt;

    @CreationTimestamp
    @Column(name = "joined_at", updatable = false) private LocalDateTime joinedAt;
}
