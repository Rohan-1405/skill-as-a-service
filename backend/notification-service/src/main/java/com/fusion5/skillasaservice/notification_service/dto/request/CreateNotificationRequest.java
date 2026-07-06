package com.fusion5.skillasaservice.notification_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Direct REST creation — an alternative to the RabbitMQ event path (NotificationEvent),
 * useful for one-off/manual notifications (e.g. admin broadcast) or services that
 * haven't been wired to publish events yet.
 */
@Data
public class CreateNotificationRequest {
    @NotNull(message = "userId is required")
    private Long userId;

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "message is required")
    private String message;

    /** One of: TEAM_INVITE, KYC_STATUS, SUBSCRIPTION, PAYMENT, PROJECT, SYSTEM, OTHER. Defaults to OTHER. */
    private String type;

    /** If true, also attempts to send this as an email to the user's registered address. */
    private boolean sendEmail = false;

    /** If true, also attempts to send this as a push notification to the user's registered device(s). */
    private boolean sendPush = false;
}
