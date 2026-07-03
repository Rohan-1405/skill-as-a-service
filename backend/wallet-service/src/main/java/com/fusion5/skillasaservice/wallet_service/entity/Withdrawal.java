package com.fusion5.skillasaservice.wallet_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "withdrawals")
@Data
public class Withdrawal {

    public enum WithdrawalStatus { PENDING, APPROVED, REJECTED, PROCESSED, FAILED }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    /** UPI, BANK_TRANSFER, PAYPAL, WISE */
    @Column(name = "payout_method", length = 50)
    private String payoutMethod;

    /** UPI ID / account number / PayPal email — whatever payoutMethod requires */
    @Column(name = "payout_details", length = 500)
    private String payoutDetails;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WithdrawalStatus status = WithdrawalStatus.PENDING;

    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;

    @Column(name = "reviewed_by")
    private Long reviewedBy;

    /** Set by auto-payout scheduler after processing */
    @Column(name = "payout_reference", length = 255)
    private String payoutReference;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
