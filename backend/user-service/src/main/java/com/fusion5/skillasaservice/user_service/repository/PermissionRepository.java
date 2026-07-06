package com.fusion5.skillasaservice.user_service.repository;

import com.fusion5.skillasaservice.user_service.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
    Optional<Permission> findByPermissionName(String permissionName);
}
