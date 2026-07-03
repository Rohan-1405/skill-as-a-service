package com.fusion5.skillasaservice.notification_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications",
       indexes = { @Index(name = "idx_notif_user", columnList = "user_id") })
@Data
public class Notification {

    /** What kind of event triggered this — lets the frontend pick an icon/route. */
    public enum NotificationType {
        TEAM_INVITE, KYC_STATUS, SUBSCRIPTION, PAYMENT, PROJECT, SYSTEM, OTHER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, length = 255)
    private String title;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private NotificationType type = NotificationType.OTHER;

    @Column(name = "is_read", nullable = false)
    private boolean read = false;

    /** Best-effort tracking of whether an email was also sent for this notification. */
    @Column(name = "email_sent", nullable = false)
    private boolean emailSent = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
