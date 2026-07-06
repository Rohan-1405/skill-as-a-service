package com.fusion5.skillasaservice.notification_service.service;

import com.fusion5.skillasaservice.notification_service.repository.DeviceTokenRepository;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;

/**
 * Sends push notifications via Firebase Cloud Messaging — IF a real service-account
 * JSON has been configured. Out of the box (placeholder path, no real credentials)
 * this initializes to a disabled state and every send() call is a logged no-op —
 * it will NOT crash the service on startup or on send.
 *
 * To actually enable push: in your Firebase project, go to
 * Project Settings → Service Accounts → Generate new private key, save the downloaded
 * JSON somewhere on disk, and set firebase.credentials.path to that file's location
 * (e.g. file:/etc/skillasaservice/firebase-service-account.json).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {

    private final DeviceTokenRepository deviceTokenRepository;

    @Value("${firebase.credentials.path:classpath:firebase-service-account.json}")
    private String credentialsPath;

    private boolean enabled = false;

    @PostConstruct
    private void init() {
        try {
            Resource resource = new PathMatchingResourcePatternResolver().getResource(credentialsPath);
            if (!resource.exists()) {
                log.warn("Firebase credentials not found at '{}' — push notifications are DISABLED "
                        + "(this is expected until real credentials are configured).", credentialsPath);
                return;
            }
            try (InputStream in = resource.getInputStream()) {
                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(GoogleCredentials.fromStream(in))
                        .build();
                if (FirebaseApp.getApps().isEmpty()) {
                    FirebaseApp.initializeApp(options);
                }
                enabled = true;
                log.info("Firebase Admin SDK initialized — push notifications are LIVE.");
            }
        } catch (Exception e) {
            log.warn("Failed to initialize Firebase ({}) — push notifications are DISABLED.", e.getMessage());
        }
    }

    /** Sends to every device token registered for this user. Best-effort per token —
     *  one bad/expired token never blocks the others or throws back to the caller. */
    public void send(Long userId, String title, String body) {
        if (!enabled) {
            log.debug("Push skipped for user {} — Firebase not configured", userId);
            return;
        }
        List<String> tokens = deviceTokenRepository.findByUserId(userId).stream()
                .map(t -> t.getFcmToken()).toList();
        if (tokens.isEmpty()) {
            log.debug("Push skipped for user {} — no registered device tokens", userId);
            return;
        }
        for (String token : tokens) {
            try {
                Message message = Message.builder()
                        .setToken(token)
                        .setNotification(com.google.firebase.messaging.Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .build())
                        .build();
                FirebaseMessaging.getInstance().send(message);
            } catch (Exception e) {
                log.warn("Push send failed for one device of user {}: {}", userId, e.getMessage());
            }
        }
    }
}
