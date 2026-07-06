package com.fusion5.skillasaservice.analytics_service.repository;

import com.fusion5.skillasaservice.analytics_service.entity.SubscriptionRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubscriptionRefRepository extends JpaRepository<SubscriptionRef, Long> {

    @Query("select s.status, count(s) from SubscriptionRef s where s.freelancerId = :freelancerId group by s.status")
    List<Object[]> statusCountsForFreelancer(@Param("freelancerId") Long freelancerId);

    @Query("select count(distinct s.clientId) from SubscriptionRef s where s.freelancerId = :freelancerId and s.status = 'ACTIVE'")
    long activeSubscriberCount(@Param("freelancerId") Long freelancerId);

    @Query("select s.status, count(s) from SubscriptionRef s where s.clientId = :clientId group by s.status")
    List<Object[]> statusCountsForClient(@Param("clientId") Long clientId);

    long countByStatus(SubscriptionRef.SubscriptionStatus status);
}
