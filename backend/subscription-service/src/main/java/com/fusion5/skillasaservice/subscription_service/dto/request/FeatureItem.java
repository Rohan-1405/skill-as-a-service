package com.fusion5.skillasaservice.subscription_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FeatureItem {

    @NotBlank(message = "featureName is required")
    private String featureName;

    private String featureValue;
}
