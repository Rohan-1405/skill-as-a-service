package com.fusion5.skillasaservice.wallet_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "wallet_transactions")
@Data
public class WalletTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "wallet_id", nullable = false)
    private Long walletId;

    @Enumerated(EnumType.STRING)
    @Column(name = "transaction_type", nullable = false)
    private TransactionType transactionType;

    @Column(nullable = false, precision = 15, scale = 2)
    private BigDecimal amount;

    // e.g. Razorpay payment_id, withdrawal request id, etc.
    @Column(name = "reference_id")
    private String referenceId;

    private String description;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum TransactionType {
        CREDIT,     // earnings received (subscription payment from client, minus platform fee)
        DEBIT,      // money spent from wallet
        DEPOSIT,    // manual top-up by the user
        WITHDRAWAL  // freelancer payout request
    }
}
