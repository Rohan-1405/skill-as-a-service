package com.fusion5.skillasaservice.chat_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages",
       indexes = { @Index(name = "idx_msg_room", columnList = "room_id"),
                   @Index(name = "idx_msg_sender", columnList = "sender_id") })
@Data
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false) private Long roomId;
    @Column(name = "sender_id", nullable = false) private Long senderId;

    @Lob
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_deleted", nullable = false)
    private boolean deleted = false;

    // Attachment fields — set when this message carries a file/image instead of (or with) text.
    // NOTE: attachmentUrl must point to an already-hosted file (e.g. S3/Wasabi presigned URL).
    // This service does not accept binary uploads directly — cloud-storage-service is Phase 2.
    @Column(name = "attachment_url", length = 1000) private String attachmentUrl;
    @Column(name = "attachment_name", length = 255) private String attachmentName;
    @Column(name = "attachment_type", length = 50) private String attachmentType;

    @CreationTimestamp
    @Column(name = "sent_at", updatable = false)
    private LocalDateTime sentAt;
}
