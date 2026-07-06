package com.fusion5.skillasaservice.storage_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "file_metadata")
@Data
public class FileMetadata {

    public enum Provider { LOCAL, S3 }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Public identifier used in URLs and the delete endpoint - a UUID, not the numeric id. */
    @Column(name = "file_key", nullable = false, unique = true, length = 100)
    private String fileKey;

    @Column(name = "original_file_name", length = 255)
    private String originalFileName;

    @Column(name = "content_type", length = 100)
    private String contentType;

    @Column(name = "size_bytes")
    private Long sizeBytes;

    /** Logical grouping - profile-images, kyc-documents, chat-attachments, project-attachments, portfolio */
    @Column(nullable = false, length = 50)
    private String folder;

    @Column(name = "uploaded_by", nullable = false)
    private Long uploadedBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Provider provider;

    /** Where the underlying bytes actually live - relative disk path for LOCAL, S3 object key for S3. */
    @Column(name = "storage_path", nullable = false, length = 500)
    private String storagePath;

    /** The URL handed back to the caller and stored in other services (freelancer_profiles.profile_image etc). */
    @Column(nullable = false, length = 1000)
    private String url;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}
