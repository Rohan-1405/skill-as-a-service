package com.fusion5.skillasaservice.user_service.controller;

import com.fusion5.skillasaservice.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/** GET /api/admin/permissions — the fixed permission-tag catalog (seeded by
 *  PermissionSeeder), drives the checkbox matrix in AdminRoles.jsx. SUPER_ADMIN-only,
 *  same reasoning as the per-user permission endpoints in AdminUserController. */
@RestController
@RequiredArgsConstructor
public class AdminPermissionController {

    private final UserService userService;

    @GetMapping("/api/admin/permissions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, List<String>>> listAllPermissionTags() {
        return ResponseEntity.ok(Map.of("permissions", userService.listAllPermissionTags()));
    }
}
