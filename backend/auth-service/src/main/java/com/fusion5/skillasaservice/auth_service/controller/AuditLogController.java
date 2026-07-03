package com.fusion5.skillasaservice.auth_service.controller;

import com.fusion5.skillasaservice.auth_service.entity.AuditLog;
import com.fusion5.skillasaservice.auth_service.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogService auditLogService;

    /**
     * GET /api/admin/audit-logs
     * Role: ADMIN or SUPER_ADMIN (enforced in SecurityConfig)
     *
     * Query params (all optional):
     *   userId  — filter by user numeric ID
     *   action  — filter by action string (e.g. LOGIN_FAILED, 2FA_ENABLED)
     *   page    — default 0
     *   size    — default 20
     *
     * Examples:
     *   GET /api/admin/audit-logs                          → all events
     *   GET /api/admin/audit-logs?userId=12                → events for user 12
     *   GET /api/admin/audit-logs?action=LOGIN_FAILED       → all failed logins
     *   GET /api/admin/audit-logs?userId=12&action=LOGOUT   → user 12 logouts
     */
    @GetMapping
    public ResponseEntity<Page<AuditLog>> getLogs(
            @RequestParam(required = false) Long   userId,
            @RequestParam(required = false) String action,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        PageRequest pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<AuditLog> result;
        if (userId != null && action != null) {
            result = auditLogService.getByUserAndAction(userId, action, pageable);
        } else if (userId != null) {
            result = auditLogService.getByUser(userId, pageable);
        } else if (action != null) {
            result = auditLogService.getByAction(action, pageable);
        } else {
            result = auditLogService.getAll(pageable);
        }

        return ResponseEntity.ok(result);
    }
}
