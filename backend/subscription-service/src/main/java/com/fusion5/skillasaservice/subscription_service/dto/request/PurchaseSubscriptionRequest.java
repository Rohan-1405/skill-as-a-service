package com.fusion5.skillasaservice.subscription_service.dto.request;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class PurchaseSubscriptionRequest {
    @NotNull(message = "planId is required")
    private Long planId;
}
