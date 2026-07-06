package com.fusion5.skillasaservice.notification_service.controller;

import com.fusion5.skillasaservice.notification_service.dto.request.CreateNotificationRequest;
import com.fusion5.skillasaservice.notification_service.dto.request.RegisterDeviceTokenRequest;
import com.fusion5.skillasaservice.notification_service.dto.request.UpdateNotificationPreferenceRequest;
import com.fusion5.skillasaservice.notification_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.notification_service.entity.DeviceToken;
import com.fusion5.skillasaservice.notification_service.entity.Notification;
import com.fusion5.skillasaservice.notification_service.entity.NotificationPreference;
import com.fusion5.skillasaservice.notification_service.repository.DeviceTokenRepository;
import com.fusion5.skillasaservice.notification_service.security.CurrentUserResolver;
import com.fusion5.skillasaservice.notification_service.service.NotificationPreferenceService;
import com.fusion5.skillasaservice.notification_service.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final NotificationPreferenceService preferenceService;
    private final DeviceTokenRepository deviceTokenRepository;
    private final CurrentUserResolver currentUserResolver;

    /** GET /api/notifications?page=0&size=20 — my notifications, newest first */
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Notification>>> myNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<Notification> result = notificationService.myNotifications(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.success("OK", result));
    }

    /** GET /api/notifications/unread-count */
    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> unreadCount() {
        return ResponseEntity.ok(ApiResponse.success("OK", Map.of("unreadCount", notificationService.unreadCount())));
    }

    /** PATCH /api/notifications/{id}/read */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<Notification>> markRead(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Marked read", notificationService.markRead(id)));
    }

    /** PATCH /api/notifications/read-all */
    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Map<String, Integer>>> markAllRead() {
        int count = notificationService.markAllRead();
        return ResponseEntity.ok(ApiResponse.success("Marked all read", Map.of("updated", count)));
    }

    /** POST /api/notifications — direct creation (alternative to the RabbitMQ event path).
     *  NOTE: there is no service-to-service auth layer yet, so this endpoint currently accepts
     *  any authenticated caller's JWT, same as every other endpoint in this platform. Restricting
     *  it to admin/service callers only is a follow-up once an internal-auth mechanism exists. */
    @PostMapping
    public ResponseEntity<ApiResponse<Notification>> create(@Valid @RequestBody CreateNotificationRequest req) {
        Notification n = notificationService.create(
                req.getUserId(), req.getTitle(), req.getMessage(), req.getType(), req.isSendEmail(), req.isSendPush());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Notification created", n));
    }

    /** DELETE /api/notifications/{id} — caller must own it */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        notificationService.deleteOwn(id);
        return ResponseEntity.ok(ApiResponse.success("Notification deleted", null));
    }

    /** GET /api/notifications/preferences — caller's channel preferences (created with defaults on first access) */
    @GetMapping("/preferences")
    public ResponseEntity<ApiResponse<NotificationPreference>> getPreferences() {
        return ResponseEntity.ok(ApiResponse.success("OK", preferenceService.getMine()));
    }

    /** PUT /api/notifications/preferences — partial update; only fields provided are changed */
    @PutMapping("/preferences")
    public ResponseEntity<ApiResponse<NotificationPreference>> updatePreferences(
            @RequestBody UpdateNotificationPreferenceRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Preferences updated", preferenceService.updateMine(req)));
    }

    /** POST /api/notifications/device-token — register (or re-register) a device for push.
     *  Call this after the client obtains an FCM token, e.g. on login or token refresh. */
    @PostMapping("/device-token")
    public ResponseEntity<ApiResponse<DeviceToken>> registerDeviceToken(@Valid @RequestBody RegisterDeviceTokenRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();
        DeviceToken token = deviceTokenRepository.findByFcmToken(req.getFcmToken()).orElseGet(DeviceToken::new);
        token.setUserId(userId);
        token.setFcmToken(req.getFcmToken());
        try {
            token.setPlatform(DeviceToken.Platform.valueOf(req.getPlatform().toUpperCase()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Invalid platform: " + req.getPlatform()));
        }
        DeviceToken saved = deviceTokenRepository.saveAndFlush(token);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Device registered", saved));
    }

    /** DELETE /api/notifications/device-token/{fcmToken} — call on logout so this device
     *  stops receiving push after sign-out. */
    @DeleteMapping("/device-token/{fcmToken}")
    public ResponseEntity<ApiResponse<Void>> unregisterDeviceToken(@PathVariable String fcmToken) {
        deviceTokenRepository.deleteByFcmToken(fcmToken);
        return ResponseEntity.ok(ApiResponse.success("Device unregistered", null));
    }
}
