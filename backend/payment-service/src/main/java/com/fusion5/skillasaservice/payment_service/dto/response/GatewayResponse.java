package com.fusion5.skillasaservice.payment_service.dto.response;

import com.fusion5.skillasaservice.payment_service.entity.PaymentGateway;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

/** Never returns raw apiKey/apiSecret/webhookSecret — only a masked last-4 preview,
 *  so a GET response can't leak live credentials even to an admin's browser history/logs. */
@Data @Builder
public class GatewayResponse {
    private Long id;
    private String gatewayName;
    private String displayName;
    private String apiKeyMasked;
    private String apiSecretMasked;
    private String webhookSecretMasked;
    private String config;
    private boolean enabled;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static GatewayResponse from(PaymentGateway g) {
        return GatewayResponse.builder()
                .id(g.getId())
                .gatewayName(g.getGatewayName())
                .displayName(g.getDisplayName())
                .apiKeyMasked(mask(g.getApiKey()))
                .apiSecretMasked(mask(g.getApiSecret()))
                .webhookSecretMasked(mask(g.getWebhookSecret()))
                .config(g.getConfig())
                .enabled(g.isEnabled())
                .createdAt(g.getCreatedAt())
                .updatedAt(g.getUpdatedAt())
                .build();
    }

    private static String mask(String value) {
        if (value == null || value.isBlank()) return null;
        if (value.length() <= 4) return "****";
        return "*".repeat(value.length() - 4) + value.substring(value.length() - 4);
    }
}
