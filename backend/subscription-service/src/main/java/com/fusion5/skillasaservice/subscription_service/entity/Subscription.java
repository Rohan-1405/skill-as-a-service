package com.fusion5.skillasaservice.subscription_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Data
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "client_id", nullable = false)
    private Long clientId;

    @Column(name = "freelancer_id", nullable = false)
    private Long freelancerId;

    @Column(name = "plan_id", nullable = false)
    private Long planId;

    // Populated after Razorpay order is created
    @Column(name = "razorpay_order_id")
    private String razorpayOrderId;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "renewal_date")
    private LocalDate renewalDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SubscriptionStatus status = SubscriptionStatus.PENDING;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum SubscriptionStatus {
        PENDING,         // payment initiated, not yet verified
        ACTIVE,          // payment completed, subscription live
        CANCELLED,       // cancelled by the client
        EXPIRED,         // past end_date, not renewed
        RENEWAL_DUE      // renewal_date reached, cron has flagged it
    }
}
