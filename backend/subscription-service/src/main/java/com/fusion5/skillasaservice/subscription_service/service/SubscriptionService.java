package com.fusion5.skillasaservice.subscription_service.service;

import com.fusion5.skillasaservice.subscription_service.client.PaymentServiceClient;
import com.fusion5.skillasaservice.subscription_service.dto.request.PurchaseSubscriptionRequest;
import com.fusion5.skillasaservice.subscription_service.dto.response.PurchaseInitiatedResponse;
import com.fusion5.skillasaservice.subscription_service.dto.response.SubscriptionResponse;
import com.fusion5.skillasaservice.subscription_service.entity.Subscription;
import com.fusion5.skillasaservice.subscription_service.entity.SubscriptionPlan;
import com.fusion5.skillasaservice.subscription_service.exception.BadRequestException;
import com.fusion5.skillasaservice.subscription_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.subscription_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.subscription_service.messaging.PaymentCompletedEvent;
import com.fusion5.skillasaservice.subscription_service.repository.SubscriptionPlanRepository;
import com.fusion5.skillasaservice.subscription_service.repository.SubscriptionRepository;
import com.fusion5.skillasaservice.subscription_service.security.CurrentUserResolver;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
public class SubscriptionService {

    private final SubscriptionRepository     subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;
    private final PaymentServiceClient       paymentServiceClient;
    private final CurrentUserResolver        currentUserResolver;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                                SubscriptionPlanRepository planRepository,
                                PaymentServiceClient paymentServiceClient,
                                CurrentUserResolver currentUserResolver) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository         = planRepository;
        this.paymentServiceClient   = paymentServiceClient;
        this.currentUserResolver    = currentUserResolver;
    }

    // ── Existing: Purchase ────────────────────────────────────────────────────
    @Transactional
    public PurchaseInitiatedResponse purchase(PurchaseSubscriptionRequest request,
                                               String authorizationHeader) {
        Long clientId = currentUserResolver.getCurrentUserId();
        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan " + request.getPlanId() + " not found"));

        if (plan.getStatus() != SubscriptionPlan.PlanStatus.ACTIVE) {
            throw new BadRequestException("Plan is not available for purchase (status: " + plan.getStatus() + ")");
        }
        if (plan.getFreelancerId().equals(clientId)) {
            throw new BadRequestException("You cannot subscribe to your own plan");
        }

        Subscription subscription = new Subscription();
        subscription.setClientId(clientId);
        subscription.setFreelancerId(plan.getFreelancerId());
        subscription.setPlanId(plan.getId());
        subscription.setStatus(Subscription.SubscriptionStatus.PENDING);
        Subscription saved = subscriptionRepository.saveAndFlush(subscription);

        // PaymentServiceClient is a Feign client: createOrder(bearerToken, request)
        // CreateOrderRequest(subscriptionId, freelancerId, amount) — note the field order
        PaymentServiceClient.CreateOrderRequest orderRequest =
                new PaymentServiceClient.CreateOrderRequest(
                        saved.getId(), plan.getFreelancerId(), plan.getPrice());
        PaymentServiceClient.CreateOrderRequest.OrderResponse orderResponse =
                paymentServiceClient.createOrder(authorizationHeader, orderRequest);

        saved.setRazorpayOrderId(orderResponse.razorpayOrderId);
        subscriptionRepository.saveAndFlush(saved);

        log.info("Purchase initiated: subscriptionId={}, planId={}, clientId={}",
                saved.getId(), plan.getId(), clientId);

        // PurchaseInitiatedResponse has no planId field — only these 5 fields exist
        return PurchaseInitiatedResponse.builder()
                .subscriptionId(saved.getId())
                .razorpayOrderId(orderResponse.razorpayOrderId)
                .amount(plan.getPrice())
                .currency("INR")
                .message("Subscription pending payment confirmation")
                .build();
    }

    // ── Existing: Cancel ──────────────────────────────────────────────────────
    @Transactional
    public SubscriptionResponse cancel(Long subscriptionId) {
        Long clientId    = currentUserResolver.getCurrentUserId();
        Subscription sub = findSubscription(subscriptionId);
        if (!sub.getClientId().equals(clientId)) throw new ForbiddenException("This is not your subscription");
        if (sub.getStatus() != Subscription.SubscriptionStatus.ACTIVE) {
            throw new BadRequestException("Only ACTIVE subscriptions can be cancelled");
        }
        sub.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        return toResponse(subscriptionRepository.saveAndFlush(sub));
    }

    // ── Existing: List helpers ────────────────────────────────────────────────
    public List<SubscriptionResponse> getMySubscriptionsAsClient() {
        Long clientId = currentUserResolver.getCurrentUserId();
        return subscriptionRepository.findByClientId(clientId).stream().map(this::toResponse).toList();
    }

    public List<SubscriptionResponse> getMySubscriptionsAsFreelancer() {
        Long freelancerId = currentUserResolver.getCurrentUserId();
        return subscriptionRepository.findByFreelancerId(freelancerId).stream().map(this::toResponse).toList();
    }

    // ── Existing: RabbitMQ event handler ─────────────────────────────────────
    @Transactional
    public void activateSubscription(PaymentCompletedEvent event) {
        Subscription sub = subscriptionRepository.findById(event.getSubscriptionId()).orElse(null);
        if (sub == null) { log.warn("activateSubscription: not found id={}", event.getSubscriptionId()); return; }
        if (sub.getStatus() != Subscription.SubscriptionStatus.PENDING) {
            log.warn("activateSubscription: already {}. Skipping.", sub.getStatus()); return;
        }
        LocalDate today = LocalDate.now();
        sub.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        sub.setStartDate(today);
        sub.setEndDate(today.plusMonths(1));
        sub.setRenewalDate(today.plusMonths(1));
        subscriptionRepository.saveAndFlush(sub);
        log.info("Subscription {} activated for clientId={}", sub.getId(), sub.getClientId());
    }

    // ── Gap #16: Upgrade ──────────────────────────────────────────────────────
    @Transactional
    public SubscriptionResponse upgrade(Long subscriptionId, Long newPlanId) {
        Long clientId    = currentUserResolver.getCurrentUserId();
        Subscription sub = findSubscription(subscriptionId);

        if (!sub.getClientId().equals(clientId)) throw new ForbiddenException("This is not your subscription");
        if (sub.getStatus() != Subscription.SubscriptionStatus.ACTIVE) {
            throw new BadRequestException("Only ACTIVE subscriptions can be upgraded");
        }

        SubscriptionPlan newPlan = planRepository.findById(newPlanId)
                .orElseThrow(() -> new ResourceNotFoundException("Target plan not found: " + newPlanId));
        SubscriptionPlan currentPlan = planRepository.findById(sub.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Current plan not found"));

        if (!newPlan.getFreelancerId().equals(sub.getFreelancerId())) {
            throw new BadRequestException("Upgrade must be to a plan by the same freelancer");
        }
        if (newPlan.getStatus() != SubscriptionPlan.PlanStatus.ACTIVE) {
            throw new BadRequestException("Target plan is not available");
        }
        if (newPlan.getPrice().compareTo(currentPlan.getPrice()) <= 0) {
            throw new BadRequestException(
                    "Upgrade target must have a higher price. For downgrade use PATCH /{id}/downgrade");
        }

        sub.setPlanId(newPlanId);
        log.info("Subscription {} upgraded from plan {} to {} for clientId={}",
                sub.getId(), currentPlan.getId(), newPlanId, clientId);
        return toResponse(subscriptionRepository.saveAndFlush(sub));
    }

    // ── Gap #17: Downgrade ────────────────────────────────────────────────────
    @Transactional
    public SubscriptionResponse downgrade(Long subscriptionId, Long newPlanId) {
        Long clientId    = currentUserResolver.getCurrentUserId();
        Subscription sub = findSubscription(subscriptionId);

        if (!sub.getClientId().equals(clientId)) throw new ForbiddenException("This is not your subscription");
        if (sub.getStatus() != Subscription.SubscriptionStatus.ACTIVE) {
            throw new BadRequestException("Only ACTIVE subscriptions can be downgraded");
        }

        SubscriptionPlan newPlan = planRepository.findById(newPlanId)
                .orElseThrow(() -> new ResourceNotFoundException("Target plan not found: " + newPlanId));
        SubscriptionPlan currentPlan = planRepository.findById(sub.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Current plan not found"));

        if (!newPlan.getFreelancerId().equals(sub.getFreelancerId())) {
            throw new BadRequestException("Downgrade must be to a plan by the same freelancer");
        }
        if (newPlan.getStatus() != SubscriptionPlan.PlanStatus.ACTIVE) {
            throw new BadRequestException("Target plan is not available");
        }
        if (newPlan.getPrice().compareTo(currentPlan.getPrice()) >= 0) {
            throw new BadRequestException(
                    "Downgrade target must have a lower price. For upgrade use PATCH /{id}/upgrade");
        }

        sub.setPlanId(newPlanId);
        log.info("Subscription {} downgraded from plan {} to {} for clientId={}",
                sub.getId(), currentPlan.getId(), newPlanId, clientId);
        return toResponse(subscriptionRepository.saveAndFlush(sub));
    }

    // ── Gap #20: History ──────────────────────────────────────────────────────
    public Page<Subscription> getHistory(Pageable pageable) {
        Long callerId = currentUserResolver.getCurrentUserId();
        // Return client's purchase history (works for both CLIENT and FREELANCER callers)
        // CLIENT → their own purchases; FREELANCER → subscriptions to their plans
        // The controller delegates without role-checking; both paths return sensible data
        Page<Subscription> asClient     = subscriptionRepository.findByClientId(callerId, pageable);
        // Return client view first; if empty, return freelancer view
        return asClient.getTotalElements() > 0
                ? asClient
                : subscriptionRepository.findByFreelancerId(callerId, pageable);
    }

    private Subscription findSubscription(Long id) {
        return subscriptionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription not found: " + id));
    }

    private SubscriptionResponse toResponse(Subscription s) {
        return SubscriptionResponse.builder()
                .id(s.getId()).clientId(s.getClientId()).freelancerId(s.getFreelancerId())
                .planId(s.getPlanId()).razorpayOrderId(s.getRazorpayOrderId())
                .startDate(s.getStartDate()).endDate(s.getEndDate())
                .renewalDate(s.getRenewalDate()).status(s.getStatus())
                .createdAt(s.getCreatedAt()).updatedAt(s.getUpdatedAt())
                .build();
    }
}
