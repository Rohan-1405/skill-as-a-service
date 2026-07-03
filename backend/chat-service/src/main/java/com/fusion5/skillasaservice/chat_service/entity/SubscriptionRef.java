package com.fusion5.skillasaservice.chat_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "subscriptions")
@Data
public class SubscriptionRef {

    public enum SubscriptionStatus { PENDING, ACTIVE, CANCELLED, EXPIRED, RENEWAL_DUE }

    @Id private Long id;
    @Column(name = "client_id") private Long clientId;
    @Column(name = "freelancer_id") private Long freelancerId;
    @Enumerated(EnumType.STRING)
    @Column(name = "status") private SubscriptionStatus status;
}
