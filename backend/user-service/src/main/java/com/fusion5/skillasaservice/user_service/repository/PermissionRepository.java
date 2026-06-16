package com.fusion5.skillasaservice.user_service.repository;

import com.fusion5.skillasaservice.user_service.entity.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {
}
