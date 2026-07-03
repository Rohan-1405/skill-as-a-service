package com.fusion5.skillasaservice.project_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

/**
 * Metadata for a file attached to a project. fileUrl must point to an already-hosted
 * file (e.g. S3/Wasabi presigned URL) — this service does not accept binary uploads
 * directly. Real upload handling depends on cloud-storage-service (Phase 2 backlog).
 */
@Entity
@Table(name = "project_attachments")
@Data
public class ProjectAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "project_id", nullable = false) private Long projectId;
    @Column(name = "uploaded_by", nullable = false) private Long uploadedBy;

    @Column(name = "file_url", nullable = false, length = 1000) private String fileUrl;
    @Column(name = "file_name", length = 255) private String fileName;
    @Column(name = "file_type", length = 50) private String fileType;

    @CreationTimestamp
    @Column(name = "uploaded_at", updatable = false)
    private LocalDateTime uploadedAt;
}
