package com.fusion5.skillasaservice.auth_service.repository;

import com.fusion5.skillasaservice.auth_service.entity.PasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetRepository extends JpaRepository<PasswordReset, Long> {

    Optional<PasswordReset> findByToken(String token);
}
