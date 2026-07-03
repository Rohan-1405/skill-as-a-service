package com.fusion5.skillasaservice.auth_service.service;

import com.fusion5.skillasaservice.auth_service.entity.AuditLog;
import com.fusion5.skillasaservice.auth_service.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    /**
     * Log an auth event asynchronously.
     * @Async means this never blocks the request thread.
     *
     * IMPORTANT: Add @EnableAsync to AuthServiceApplication.java:
     *   @EnableAsync
     *   @SpringBootApplication
     *   public class AuthServiceApplication { ... }
     */
    @Async
    public void log(Long userId, String action, String detail, String ipAddress) {
        try {
            AuditLog entry = new AuditLog();
            entry.setUserId(userId);
            entry.setAction(action);
            entry.setDetail(detail);
            entry.setIpAddress(ipAddress);
            auditLogRepository.save(entry);
        } catch (Exception e) {
            log.error("[AUDIT] Failed to persist log entry: {}", e.getMessage());
        }
    }

    /** Convenience overload when IP is not available */
    @Async
    public void log(Long userId, String action, String detail) {
        log(userId, action, detail, null);
    }

    // ── Admin query methods ───────────────────────────────────────────────────

    public Page<AuditLog> getAll(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    public Page<AuditLog> getByUser(Long userId, Pageable pageable) {
        return auditLogRepository.findByUserId(userId, pageable);
    }

    public Page<AuditLog> getByAction(String action, Pageable pageable) {
        return auditLogRepository.findByAction(action.toUpperCase(), pageable);
    }

    public Page<AuditLog> getByUserAndAction(Long userId, String action, Pageable pageable) {
        return auditLogRepository.findByUserIdAndAction(userId, action.toUpperCase(), pageable);
    }
}
