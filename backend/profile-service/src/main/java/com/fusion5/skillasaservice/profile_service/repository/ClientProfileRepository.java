package com.fusion5.skillasaservice.profile_service.repository;

import com.fusion5.skillasaservice.profile_service.entity.ClientProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientProfileRepository extends JpaRepository<ClientProfile, Long> {
    Optional<ClientProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
