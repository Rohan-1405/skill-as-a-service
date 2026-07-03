package com.fusion5.skillasaservice.subscription_service.repository;

import com.fusion5.skillasaservice.subscription_service.entity.Subscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    List<Subscription> findByClientId(Long clientId);
    List<Subscription> findByFreelancerId(Long freelancerId);

    // ── Gap #15: used by deletePlan() to block deletion ──────────────────────
    long countByPlanIdAndStatus(Long planId, Subscription.SubscriptionStatus status);

    // ── Gap #20: paginated history ────────────────────────────────────────────
    Page<Subscription> findByClientId(Long clientId, Pageable pageable);
    Page<Subscription> findByFreelancerId(Long freelancerId, Pageable pageable);

    // Cron: find ACTIVE subscriptions where today >= renewal_date
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.renewalDate <= :today")
    List<Subscription> findDueForRenewal(LocalDate today);

    // Cron: find ACTIVE subscriptions where today > end_date
    @Query("SELECT s FROM Subscription s WHERE s.status = 'ACTIVE' AND s.endDate < :today")
    List<Subscription> findExpired(LocalDate today);
}
