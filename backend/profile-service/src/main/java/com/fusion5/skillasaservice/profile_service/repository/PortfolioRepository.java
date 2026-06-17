package com.fusion5.skillasaservice.profile_service.repository;

import com.fusion5.skillasaservice.profile_service.entity.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {
    List<Portfolio> findByUserId(Long userId);
    long countByUserId(Long userId);
}
