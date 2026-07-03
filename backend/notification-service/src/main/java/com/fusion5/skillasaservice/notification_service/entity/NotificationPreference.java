package com.fusion5.skillasaservice.notification_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/** One row per user. Created lazily with defaults the first time it's read or written. */
@Entity
@Table(name = "notification_preferences",
       uniqueConstraints = @UniqueConstraint(columnNames = "user_id"))
@Data
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Column(name = "email_enabled", nullable = false)
    private boolean emailEnabled = true;

    @Column(name = "in_app_enabled", nullable = false)
    private boolean inAppEnabled = true;

    /** Reserved for when FCM push is actually wired up (Phase 2). Stored now so the
     *  frontend can build the settings UI ahead of that; has no effect yet since no
     *  push send path exists. */
    @Column(name = "push_enabled", nullable = false)
    private boolean pushEnabled = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
