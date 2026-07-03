package com.fusion5.skillasaservice.notification_service.dto.request;

import lombok.Data;

/**
 * All fields optional — only provided fields are changed (partial update).
 * pushEnabled is stored but has no effect yet (no FCM send path wired up).
 */
@Data
public class UpdateNotificationPreferenceRequest {
    private Boolean emailEnabled;
    private Boolean inAppEnabled;
    private Boolean pushEnabled;
}
