package com.fusion5.skillasaservice.notification_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/** One row per (user, device). A user can have multiple tokens (phone + web browser, etc). */
@Entity
@Table(name = "device_tokens",
       uniqueConstraints = @UniqueConstraint(columnNames = "fcm_token"))
@Data
public class DeviceToken {

    public enum Platform { ANDROID, IOS, WEB }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "fcm_token", nullable = false, unique = true, length = 500)
    private String fcmToken;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Platform platform;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
