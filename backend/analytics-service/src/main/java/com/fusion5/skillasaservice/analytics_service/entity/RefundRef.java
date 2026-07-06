package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Read-only mirror of payment-service's `refunds` table. */
@Entity
@Table(name = "refunds")
@Data
public class RefundRef {

    @Id private Long id;

    @Column(name = "payment_id") private Long paymentId;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum RefundStatus { INITIATED, PROCESSING, COMPLETED, FAILED }
}
