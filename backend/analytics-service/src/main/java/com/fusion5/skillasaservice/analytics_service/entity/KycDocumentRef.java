package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/** Read-only mirror of profile-service's `kyc_documents` table. */
@Entity
@Table(name = "kyc_documents")
@Data
public class KycDocumentRef {

    @Id private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status")
    private VerificationStatus verificationStatus;

    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    public enum VerificationStatus { PENDING, APPROVED, REJECTED }
}
