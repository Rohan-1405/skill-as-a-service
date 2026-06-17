package com.fusion5.skillasaservice.profile_service.repository;

import com.fusion5.skillasaservice.profile_service.entity.AuthUserRef;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthUserRefRepository extends JpaRepository<AuthUserRef, Long> {
    Optional<AuthUserRef> findByUuid(String uuid);
}
