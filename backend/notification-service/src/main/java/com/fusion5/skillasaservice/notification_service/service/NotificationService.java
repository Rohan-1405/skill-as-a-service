package com.fusion5.skillasaservice.notification_service.service;

import com.fusion5.skillasaservice.notification_service.entity.AuthUserRef;
import com.fusion5.skillasaservice.notification_service.entity.Notification;
import com.fusion5.skillasaservice.notification_service.entity.NotificationPreference;
import com.fusion5.skillasaservice.notification_service.entity.Notification.NotificationType;
import com.fusion5.skillasaservice.notification_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.notification_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.notification_service.repository.AuthUserRefRepository;
import com.fusion5.skillasaservice.notification_service.repository.NotificationRepository;
import com.fusion5.skillasaservice.notification_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final AuthUserRefRepository authUserRefRepository;
    private final CurrentUserResolver currentUserResolver;
    private final EmailService emailService;
    private final NotificationPreferenceService preferenceService;

    /** Creates the in-app notification (unless the user disabled in-app), and best-effort
     *  sends an email if requested AND the user hasn't disabled email notifications. */
    @Transactional
    public Notification create(Long userId, String title, String message, String typeRaw, boolean sendEmail) {
        NotificationType type = parseType(typeRaw);
        NotificationPreference prefs = preferenceService.getOrCreate(userId);

        Notification n = new Notification();
        n.setUserId(userId);
        n.setTitle(title);
        n.setMessage(message);
        n.setType(type);

        if (sendEmail && prefs.isEmailEnabled()) {
            String email = authUserRefRepository.findById(userId).map(AuthUserRef::getEmail).orElse(null);
            boolean sent = emailService.send(email, title, message);
            n.setEmailSent(sent);
        } else if (sendEmail) {
            log.info("Skipped email for user {} — email notifications disabled in preferences", userId);
        }

        if (!prefs.isInAppEnabled()) {
            // User opted out of in-app notifications entirely — honor it, don't persist.
            log.info("Skipped in-app notification for user {} — in-app notifications disabled", userId);
            n.setId(null);
            return n; // returned but not saved, so callers still see what "would have" been created
        }

        Notification saved = notificationRepository.saveAndFlush(n);
        log.info("Notification {} created for user {} (type={}, emailSent={})",
                saved.getId(), userId, type, saved.isEmailSent());
        return saved;
    }

    /** Paginated list for the calling user, newest first. */
    public Page<Notification> myNotifications(Pageable pageable) {
        Long userId = currentUserResolver.getCurrentUserId();
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public long unreadCount() {
        Long userId = currentUserResolver.getCurrentUserId();
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    @Transactional
    public Notification markRead(Long id) {
        Long userId = currentUserResolver.getCurrentUserId();
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        if (!n.getUserId().equals(userId)) {
            throw new ForbiddenException("This notification does not belong to you");
        }
        n.setRead(true);
        return notificationRepository.saveAndFlush(n);
    }

    @Transactional
    public int markAllRead() {
        Long userId = currentUserResolver.getCurrentUserId();
        return notificationRepository.markAllReadForUser(userId);
    }

    /** DELETE /api/notifications/{id} — caller must own it. */
    @Transactional
    public void deleteOwn(Long id) {
        Long userId = currentUserResolver.getCurrentUserId();
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        if (!n.getUserId().equals(userId)) {
            throw new ForbiddenException("This notification does not belong to you");
        }
        notificationRepository.delete(n);
    }

    private NotificationType parseType(String raw) {
        if (raw == null || raw.isBlank()) return NotificationType.OTHER;
        try {
            return NotificationType.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return NotificationType.OTHER;
        }
    }
}
