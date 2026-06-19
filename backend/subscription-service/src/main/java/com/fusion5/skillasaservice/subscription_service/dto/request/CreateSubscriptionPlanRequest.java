package com.fusion5.skillasaservice.subscription_service.dto.request;

import com.fusion5.skillasaservice.subscription_service.entity.SubscriptionPlan;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CreateSubscriptionPlanRequest {

    @NotBlank(message = "planName is required")
    private String planName;

    @NotNull(message = "price is required")
    @PositiveOrZero(message = "price must be zero or positive")
    private BigDecimal price;

    @NotNull(message = "billingCycle is required")
    private SubscriptionPlan.BillingCycle billingCycle;

    @NotBlank(message = "description is required")
    private String description;

    // Optional - a plan can be created with no features and have them added later via update
    @Valid
    private List<FeatureItem> features;
}
