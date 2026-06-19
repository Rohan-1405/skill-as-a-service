package com.fusion5.skillasaservice.subscription_service.repository;

import com.fusion5.skillasaservice.subscription_service.entity.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    List<SubscriptionPlan> findByFreelancerId(Long freelancerId);
    long countByFreelancerIdAndStatus(Long freelancerId, SubscriptionPlan.PlanStatus status);
}
