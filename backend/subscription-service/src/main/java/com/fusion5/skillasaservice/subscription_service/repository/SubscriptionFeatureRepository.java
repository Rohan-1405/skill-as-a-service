package com.fusion5.skillasaservice.subscription_service.repository;

import com.fusion5.skillasaservice.subscription_service.entity.SubscriptionFeature;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionFeatureRepository extends JpaRepository<SubscriptionFeature, Long> {
    List<SubscriptionFeature> findByPlanId(Long planId);
    void deleteByPlanId(Long planId);
}
