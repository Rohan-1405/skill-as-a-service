package com.fusion5.skillasaservice.payment_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateGatewayRequest {
    @NotBlank(message = "gatewayName is required")
    private String gatewayName;

    @NotBlank(message = "displayName is required")
    private String displayName;

    private String apiKey;
    private String apiSecret;
    private String webhookSecret;
    private String config;
}
