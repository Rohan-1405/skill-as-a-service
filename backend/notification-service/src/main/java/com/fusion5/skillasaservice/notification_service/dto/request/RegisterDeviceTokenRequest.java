package com.fusion5.skillasaservice.notification_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterDeviceTokenRequest {
    @NotBlank(message = "fcmToken is required")
    private String fcmToken;

    @NotBlank(message = "platform is required (ANDROID, IOS, or WEB)")
    private String platform;
}
