package com.fusion5.skillasaservice.subscription_service.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;
import com.fusion5.skillasaservice.subscription_service.entity.SubscriptionPlan;

@Data
public class UpdateSubscriptionPlanRequest {

    private String planName;

    @PositiveOrZero(message = "price must be zero or positive")
    private BigDecimal price;

    private SubscriptionPlan.BillingCycle billingCycle;

    private String description;

    // null = leave existing features untouched; present (even empty list) = full replace
    @Valid
    private List<FeatureItem> features;
}
