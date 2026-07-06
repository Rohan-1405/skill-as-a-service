package com.fusion5.skillasaservice.analytics_service.repository;

import com.fusion5.skillasaservice.analytics_service.entity.WithdrawalRef;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WithdrawalRefRepository extends JpaRepository<WithdrawalRef, Long> {
    long countByStatus(WithdrawalRef.WithdrawalStatus status);
}
