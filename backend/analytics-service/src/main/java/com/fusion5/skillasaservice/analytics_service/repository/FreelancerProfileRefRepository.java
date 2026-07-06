package com.fusion5.skillasaservice.analytics_service.repository;

import com.fusion5.skillasaservice.analytics_service.entity.FreelancerProfileRef;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FreelancerProfileRefRepository extends JpaRepository<FreelancerProfileRef, Long> {
    Optional<FreelancerProfileRef> findByUserId(Long userId);
}
