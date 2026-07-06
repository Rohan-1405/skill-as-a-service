package com.fusion5.skillasaservice.notification_service.messaging;

import lombok.Data;

/**
 * Generic notification event. Any service can publish this to the shared
 * "skillasaservice.exchange" using a routing key matching "notification.#"
 * (e.g. "notification.team.invite", "notification.kyc.approved") and
 * notification-service will pick it up regardless of which specific key was used.
 */
@Data
public class NotificationEvent {
    private Long userId;
    private String title;
    private String message;

    /** Must match one of Notification.NotificationType, e.g. TEAM_INVITE, KYC_STATUS. Defaults to OTHER if blank/invalid. */
    private String type;

    /** If true and the user has an email on file, also send an email. */
    private boolean sendEmail;

    /** If true and the user has registered device token(s) and push is enabled/configured, also send a push notification. */
    private boolean sendPush;
}
