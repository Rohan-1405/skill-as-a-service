package com.fusion5.skillasaservice.payment_service.dto.request;

import lombok.Data;

/** All fields optional — only provided ones are updated. */
@Data
public class ConfigureGatewayRequest {
    private String displayName;
    private String apiKey;
    private String apiSecret;
    private String webhookSecret;
    private String config;
}
