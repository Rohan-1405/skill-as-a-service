package com.fusion5.skillasaservice.notification_service.repository;

import com.fusion5.skillasaservice.notification_service.entity.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {
    List<DeviceToken> findByUserId(Long userId);
    Optional<DeviceToken> findByFcmToken(String fcmToken);
    void deleteByFcmToken(String fcmToken);
}
