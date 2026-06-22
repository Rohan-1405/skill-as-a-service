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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class SubscriptionService {

    private static final Logger log = LoggerFactory.getLogger(SubscriptionService.class);

    private final SubscriptionRepository subscriptionRepository;
    private final SubscriptionPlanRepository planRepository;
    private final PaymentServiceClient paymentServiceClient;
    private final CurrentUserResolver currentUserResolver;

    public SubscriptionService(SubscriptionRepository subscriptionRepository,
                                SubscriptionPlanRepository planRepository,
                                PaymentServiceClient paymentServiceClient,
                                CurrentUserResolver currentUserResolver) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.paymentServiceClient = paymentServiceClient;
        this.currentUserResolver = currentUserResolver;
    }

    /**
     * Day 6 - Purchase API.
     * CLIENT calls this to subscribe to a freelancer's plan.
     * 1. Validates the plan is ACTIVE.
     * 2. Creates a PENDING subscription.
     * 3. Calls payment-service (Feign/REST) to create a Razorpay order synchronously.
     * 4. Stores the razorpayOrderId on the subscription.
     * 5. Returns 202 with the order details so the client can open the Razorpay checkout.
     * Subscription only becomes ACTIVE once payment is verified (via RabbitMQ event).
     */
    @Transactional
    public PurchaseInitiatedResponse purchase(PurchaseSubscriptionRequest request,
                                               String authorizationHeader) {
        Long clientId = currentUserResolver.getCurrentUserId();

        SubscriptionPlan plan = planRepository.findById(request.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subscription plan " + request.getPlanId() + " not found"));

        if (plan.getStatus() != SubscriptionPlan.PlanStatus.ACTIVE) {
            throw new BadRequestException("Plan is not available for purchase (status: " + plan.getStatus() + ")");
        }

        if (plan.getFreelancerId().equals(clientId)) {
            throw new BadRequestException("You cannot subscribe to your own plan");
        }

        // Create PENDING subscription
        Subscription subscription = new Subscription();
        subscription.setClientId(clientId);
        subscription.setFreelancerId(plan.getFreelancerId());
        subscription.setPlanId(plan.getId());
        subscription.setStatus(Subscription.SubscriptionStatus.PENDING);
        Subscription saved = subscriptionRepository.saveAndFlush(subscription);

        // Call payment-service synchronously via Feign to get Razorpay order_id
        PaymentServiceClient.CreateOrderRequest orderRequest =
                new PaymentServiceClient.CreateOrderRequest(
                        saved.getId(), plan.getFreelancerId(), plan.getPrice());

        PaymentServiceClient.CreateOrderRequest.OrderResponse orderResponse =
                paymentServiceClient.createOrder(authorizationHeader, orderRequest);

        // Store the order id so we can match it when the RabbitMQ event arrives
        saved.setRazorpayOrderId(orderResponse.razorpayOrderId);
        subscriptionRepository.saveAndFlush(saved);

        log.info("Purchase initiated: subscriptionId={} razorpayOrderId={}",
                saved.getId(), orderResponse.razorpayOrderId);

        return PurchaseInitiatedResponse.builder()
                .subscriptionId(saved.getId())
                .razorpayOrderId(orderResponse.razorpayOrderId)
                .amount(plan.getPrice())
                .currency("INR")
                .message("Complete payment using the razorpayOrderId to activate your subscription")
                .build();
    }

    /**
     * Day 6 - Cancel API.
     * CLIENT can cancel their own ACTIVE subscription.
     */
    @Transactional
    public SubscriptionResponse cancel(Long subscriptionId) {
        Long clientId = currentUserResolver.getCurrentUserId();

        Subscription subscription = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subscription " + subscriptionId + " not found"));

        if (!subscription.getClientId().equals(clientId)) {
            throw new ForbiddenException("You can only cancel your own subscriptions");
        }

        if (subscription.getStatus() != Subscription.SubscriptionStatus.ACTIVE) {
            throw new BadRequestException(
                    "Only an ACTIVE subscription can be cancelled (current: " + subscription.getStatus() + ")");
        }

        subscription.setStatus(Subscription.SubscriptionStatus.CANCELLED);
        return toResponse(subscriptionRepository.saveAndFlush(subscription));
    }

    public List<SubscriptionResponse> getMySubscriptionsAsClient() {
        Long clientId = currentUserResolver.getCurrentUserId();
        return subscriptionRepository.findByClientId(clientId)
                .stream().map(this::toResponse).toList();
    }

    public List<SubscriptionResponse> getMySubscriptionsAsFreelancer() {
        Long freelancerId = currentUserResolver.getCurrentUserId();
        return subscriptionRepository.findByFreelancerId(freelancerId)
                .stream().map(this::toResponse).toList();
    }

    /**
     * Called by RabbitMQ listener when payment.completed arrives from payment-service.
     * Activates the subscription and sets dates based on the plan's billing cycle.
     */
    @Transactional
    public void activateSubscription(PaymentCompletedEvent event) {
        Subscription subscription = subscriptionRepository.findById(event.getSubscriptionId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subscription " + event.getSubscriptionId() + " not found"));

        if (subscription.getStatus() != Subscription.SubscriptionStatus.PENDING) {
            log.warn("Skipping activation - subscription {} is already {}", event.getSubscriptionId(), subscription.getStatus());
            return;
        }

        SubscriptionPlan plan = planRepository.findById(subscription.getPlanId())
                .orElseThrow(() -> new ResourceNotFoundException("Plan not found"));

        LocalDate today = LocalDate.now();
        LocalDate endDate = switch (plan.getBillingCycle()) {
            case MONTHLY -> today.plusMonths(1);
            case QUARTERLY -> today.plusMonths(3);
            case YEARLY -> today.plusYears(1);
        };

        subscription.setStatus(Subscription.SubscriptionStatus.ACTIVE);
        subscription.setStartDate(today);
        subscription.setEndDate(endDate);
        subscription.setRenewalDate(endDate); // renewal triggered on the last day
        subscriptionRepository.saveAndFlush(subscription);

        log.info("Subscription {} activated. Active until {}", subscription.getId(), endDate);
    }

    private SubscriptionResponse toResponse(Subscription s) {
        return SubscriptionResponse.builder()
                .id(s.getId()).clientId(s.getClientId()).freelancerId(s.getFreelancerId())
                .planId(s.getPlanId()).razorpayOrderId(s.getRazorpayOrderId())
                .startDate(s.getStartDate()).endDate(s.getEndDate()).renewalDate(s.getRenewalDate())
                .status(s.getStatus()).createdAt(s.getCreatedAt()).updatedAt(s.getUpdatedAt())
                .build();
    }
}
