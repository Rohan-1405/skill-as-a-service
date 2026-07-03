package com.fusion5.skillasaservice.subscription_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PlanChangeRequest {
    @NotNull(message = "newPlanId is required")
    private Long newPlanId;
}
