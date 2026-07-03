package com.fusion5.skillasaservice.notification_service.service;

import com.fusion5.skillasaservice.notification_service.dto.request.UpdateNotificationPreferenceRequest;
import com.fusion5.skillasaservice.notification_service.entity.NotificationPreference;
import com.fusion5.skillasaservice.notification_service.repository.NotificationPreferenceRepository;
import com.fusion5.skillasaservice.notification_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationPreferenceService {

    private final NotificationPreferenceRepository preferenceRepository;
    private final CurrentUserResolver currentUserResolver;

    /** Returns the caller's preferences, creating a default row on first access. */
    @Transactional
    public NotificationPreference getMine() {
        return getOrCreate(currentUserResolver.getCurrentUserId());
    }

    @Transactional
    public NotificationPreference updateMine(UpdateNotificationPreferenceRequest req) {
        NotificationPreference pref = getOrCreate(currentUserResolver.getCurrentUserId());
        if (req.getEmailEnabled() != null) pref.setEmailEnabled(req.getEmailEnabled());
        if (req.getInAppEnabled() != null) pref.setInAppEnabled(req.getInAppEnabled());
        if (req.getPushEnabled() != null)  pref.setPushEnabled(req.getPushEnabled());
        return preferenceRepository.saveAndFlush(pref);
    }

    /** Used internally by NotificationService before creating/emailing — not exposed directly. */
    @Transactional
    public NotificationPreference getOrCreate(Long userId) {
        return preferenceRepository.findByUserId(userId).orElseGet(() -> {
            NotificationPreference p = new NotificationPreference();
            p.setUserId(userId);
            return preferenceRepository.saveAndFlush(p);
        });
    }
}
