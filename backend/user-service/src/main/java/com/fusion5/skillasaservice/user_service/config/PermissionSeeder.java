package com.fusion5.skillasaservice.user_service.config;

import com.fusion5.skillasaservice.user_service.entity.Permission;
import com.fusion5.skillasaservice.user_service.repository.PermissionRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * The permission tag set is fixed (matches what the frontend's AdminRoles.jsx already
 * expects) — there's no "create a new permission tag" endpoint, just this seed list.
 * Runs on every startup but only inserts tags that don't already exist, so it's safe
 * to run repeatedly.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PermissionSeeder {

    private final PermissionRepository permissionRepository;

    private static final List<String> FIXED_PERMISSIONS = List.of(
            "USERS", "KYC", "WITHDRAWALS", "PAYMENTS", "SUBSCRIPTIONS", "CMS", "ANALYTICS", "SETTINGS"
    );

    @PostConstruct
    public void seed() {
        for (String name : FIXED_PERMISSIONS) {
            if (permissionRepository.findByPermissionName(name).isEmpty()) {
                Permission p = new Permission();
                p.setPermissionName(name);
                permissionRepository.save(p);
                log.info("Seeded permission tag: {}", name);
            }
        }
    }
}
