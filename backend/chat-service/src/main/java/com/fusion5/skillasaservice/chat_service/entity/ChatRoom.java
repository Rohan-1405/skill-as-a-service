package com.fusion5.skillasaservice.chat_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_rooms")
@Data
public class ChatRoom {

    public enum RoomType { PRIVATE, GROUP }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "room_type", nullable = false, length = 10)
    private RoomType roomType;

    @Column(length = 255)
    private String name;

    // For PRIVATE rooms: FK to subscriptions.id
    @Column(name = "subscription_id")
    private Long subscriptionId;

    // For GROUP rooms: FK to projects.id (created by project-service event)
    @Column(name = "project_id")
    private Long projectId;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
