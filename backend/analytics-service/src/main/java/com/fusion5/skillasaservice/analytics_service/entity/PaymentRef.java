package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Read-only mirror of payment-service's `payments` table. */
@Entity
@Table(name = "payments")
@Data
public class PaymentRef {

    @Id private Long id;

    @Column(name = "payer_id") private Long payerId;   // client's user id
    @Column(name = "payee_id") private Long payeeId;   // freelancer's user id
    @Column(name = "subscription_id") private Long subscriptionId;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum PaymentStatus { PENDING, COMPLETED, FAILED, REFUNDED }
}
