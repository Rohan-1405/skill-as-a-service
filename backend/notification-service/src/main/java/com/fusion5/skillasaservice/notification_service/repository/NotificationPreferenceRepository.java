package com.fusion5.skillasaservice.notification_service.repository;

import com.fusion5.skillasaservice.notification_service.entity.NotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {
    Optional<NotificationPreference> findByUserId(Long userId);
}
