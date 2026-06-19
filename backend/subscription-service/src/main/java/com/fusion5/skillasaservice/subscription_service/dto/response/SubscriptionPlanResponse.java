package com.fusion5.skillasaservice.subscription_service.dto.response;

import com.fusion5.skillasaservice.subscription_service.entity.SubscriptionPlan;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class SubscriptionPlanResponse {
    private Long id;
    private Long freelancerId;
    private String planName;
    private BigDecimal price;
    private SubscriptionPlan.BillingCycle billingCycle;
    private String description;
    private SubscriptionPlan.PlanStatus status;
    private List<FeatureResponse> features;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
