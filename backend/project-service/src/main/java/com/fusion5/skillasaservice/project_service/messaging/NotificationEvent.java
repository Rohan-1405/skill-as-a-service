package com.fusion5.skillasaservice.project_service.messaging;

import lombok.Builder;
import lombok.Data;

/**
 * Mirrors notification-service's NotificationEvent field-for-field (same convention as
 * ProjectTeamCreatedEvent, which chat-service also mirrors locally). Published to the
 * shared exchange with a "notification.*" routing key.
 */
@Data
@Builder
public class NotificationEvent {
    private Long userId;
    private String title;
    private String message;
    private String type;
    private boolean sendEmail;
    private boolean sendPush;
}
