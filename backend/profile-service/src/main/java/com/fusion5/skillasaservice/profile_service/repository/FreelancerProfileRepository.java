package com.fusion5.skillasaservice.profile_service.repository;

import com.fusion5.skillasaservice.profile_service.entity.FreelancerProfile;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FreelancerProfileRepository extends JpaRepository<FreelancerProfile, Long> {
    Optional<FreelancerProfile> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
}
