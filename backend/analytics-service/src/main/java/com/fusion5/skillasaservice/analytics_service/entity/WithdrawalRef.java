package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** Read-only mirror of wallet-service's `withdrawals` table. */
@Entity
@Table(name = "withdrawals")
@Data
public class WithdrawalRef {

    @Id private Long id;

    @Column(name = "user_id") private Long userId;
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private WithdrawalStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum WithdrawalStatus { PENDING, APPROVED, REJECTED, PROCESSED, FAILED }
}
