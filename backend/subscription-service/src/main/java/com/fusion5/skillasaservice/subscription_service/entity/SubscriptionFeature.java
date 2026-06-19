package com.fusion5.skillasaservice.subscription_service.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "subscription_features")
@Data
public class SubscriptionFeature {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "plan_id", nullable = false)
    private Long planId;

    @Column(name = "feature_name", nullable = false)
    private String featureName;

    @Column(name = "feature_value")
    private String featureValue;
}
