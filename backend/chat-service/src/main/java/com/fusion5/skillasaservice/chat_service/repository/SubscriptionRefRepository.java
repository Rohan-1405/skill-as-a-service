package com.fusion5.skillasaservice.chat_service.repository;
import com.fusion5.skillasaservice.chat_service.entity.SubscriptionRef;
import com.fusion5.skillasaservice.chat_service.entity.SubscriptionRef.SubscriptionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface SubscriptionRefRepository extends JpaRepository<SubscriptionRef, Long> {
    Optional<SubscriptionRef> findByClientIdAndFreelancerIdAndStatus(
            Long clientId, Long freelancerId, SubscriptionStatus status);
    Optional<SubscriptionRef> findByFreelancerIdAndClientIdAndStatus(
            Long freelancerId, Long clientId, SubscriptionStatus status);
}
