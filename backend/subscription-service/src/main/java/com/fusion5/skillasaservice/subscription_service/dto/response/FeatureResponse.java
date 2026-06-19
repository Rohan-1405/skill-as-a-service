package com.fusion5.skillasaservice.subscription_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeatureResponse {
    private Long id;
    private String featureName;
    private String featureValue;
}
