package com.fusion5.skillasaservice.auth_service.repository;

import com.fusion5.skillasaservice.auth_service.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    Page<AuditLog> findByUserId(Long userId, Pageable pageable);
    Page<AuditLog> findByAction(String action, Pageable pageable);
    Page<AuditLog> findByUserIdAndAction(Long userId, String action, Pageable pageable);
}
