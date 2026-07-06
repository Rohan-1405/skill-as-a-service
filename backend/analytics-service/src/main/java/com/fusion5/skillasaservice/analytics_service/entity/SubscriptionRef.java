package com.fusion5.skillasaservice.analytics_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/** Read-only mirror of subscription-service's `subscriptions` table. */
@Entity
@Table(name = "subscriptions")
@Data
public class SubscriptionRef {

    @Id private Long id;

    @Column(name = "client_id") private Long clientId;
    @Column(name = "freelancer_id") private Long freelancerId;
    @Column(name = "plan_id") private Long planId;

    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum SubscriptionStatus { PENDING, ACTIVE, CANCELLED, EXPIRED, RENEWAL_DUE }
}
