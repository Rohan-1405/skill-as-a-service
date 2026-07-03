package com.fusion5.skillasaservice.subscription_service.service;

import com.fusion5.skillasaservice.subscription_service.dto.request.CreateSubscriptionPlanRequest;
import com.fusion5.skillasaservice.subscription_service.dto.request.FeatureItem;
import com.fusion5.skillasaservice.subscription_service.dto.request.UpdateSubscriptionPlanRequest;
import com.fusion5.skillasaservice.subscription_service.dto.response.FeatureResponse;
import com.fusion5.skillasaservice.subscription_service.dto.response.SubscriptionPlanResponse;
import com.fusion5.skillasaservice.subscription_service.entity.Subscription;
import com.fusion5.skillasaservice.subscription_service.entity.SubscriptionFeature;
import com.fusion5.skillasaservice.subscription_service.entity.SubscriptionPlan;
import com.fusion5.skillasaservice.subscription_service.exception.BadRequestException;
import com.fusion5.skillasaservice.subscription_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.subscription_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.subscription_service.repository.SubscriptionFeatureRepository;
import com.fusion5.skillasaservice.subscription_service.repository.SubscriptionPlanRepository;
import com.fusion5.skillasaservice.subscription_service.repository.SubscriptionRepository;
import com.fusion5.skillasaservice.subscription_service.security.CurrentUserResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SubscriptionPlanService {

    private final SubscriptionPlanRepository    planRepository;
    private final SubscriptionFeatureRepository featureRepository;
    private final SubscriptionRepository        subscriptionRepository;  // for subscriber check
    private final CurrentUserResolver           currentUserResolver;

    @Value("${app.subscription.max-active-plans-per-freelancer:3}")
    private int maxActivePlans;

    public SubscriptionPlanService(SubscriptionPlanRepository planRepository,
                                    SubscriptionFeatureRepository featureRepository,
                                    SubscriptionRepository subscriptionRepository,
                                    CurrentUserResolver currentUserResolver) {
        this.planRepository         = planRepository;
        this.featureRepository      = featureRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.currentUserResolver    = currentUserResolver;
    }

    @Transactional
    public SubscriptionPlanResponse createPlan(CreateSubscriptionPlanRequest request) {
        Long freelancerId = currentUserResolver.getCurrentUserId();
        long activeCount = planRepository.countByFreelancerIdAndStatus(freelancerId, SubscriptionPlan.PlanStatus.ACTIVE);
        if (activeCount >= maxActivePlans) {
            throw new BadRequestException("Maximum of " + maxActivePlans + " active subscription plans reached");
        }
        SubscriptionPlan plan = new SubscriptionPlan();
        plan.setFreelancerId(freelancerId);
        plan.setPlanName(request.getPlanName());
        plan.setPrice(request.getPrice());
        plan.setBillingCycle(request.getBillingCycle());
        plan.setDescription(request.getDescription());
        plan.setStatus(SubscriptionPlan.PlanStatus.ACTIVE);
        SubscriptionPlan saved = planRepository.saveAndFlush(plan);
        if (request.getFeatures() != null) saveFeatures(saved.getId(), request.getFeatures());
        return toResponse(saved);
    }

    public SubscriptionPlanResponse getPlan(Long planId) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan " + planId + " not found"));
        return toResponse(plan);
    }

    public List<SubscriptionPlanResponse> listMyPlans() {
        Long freelancerId = currentUserResolver.getCurrentUserId();
        return planRepository.findByFreelancerId(freelancerId).stream().map(this::toResponse).toList();
    }

    @Transactional
    public SubscriptionPlanResponse updatePlan(Long planId, UpdateSubscriptionPlanRequest request) {
        SubscriptionPlan plan = findEditablePlan(planId);
        requireOwnership(plan.getFreelancerId());
        if (request.getPlanName()    != null) plan.setPlanName(request.getPlanName());
        if (request.getPrice()       != null) plan.setPrice(request.getPrice());
        if (request.getBillingCycle()!= null) plan.setBillingCycle(request.getBillingCycle());
        if (request.getDescription() != null) plan.setDescription(request.getDescription());
        SubscriptionPlan saved = planRepository.saveAndFlush(plan);
        if (request.getFeatures() != null) {
            featureRepository.deleteByPlanId(planId);
            saveFeatures(planId, request.getFeatures());
        }
        return toResponse(saved);
    }

    @Transactional
    public SubscriptionPlanResponse pausePlan(Long planId) {
        SubscriptionPlan plan = findEditablePlan(planId);
        requireOwnership(plan.getFreelancerId());
        if (plan.getStatus() != SubscriptionPlan.PlanStatus.ACTIVE) {
            throw new BadRequestException("Only an ACTIVE plan can be paused (current: " + plan.getStatus() + ")");
        }
        plan.setStatus(SubscriptionPlan.PlanStatus.PAUSED);
        return toResponse(planRepository.saveAndFlush(plan));
    }

    // ── Gap #15: deletePlan WITH active subscriber check ──────────────────────
    @Transactional
    public void deletePlan(Long planId) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan " + planId + " not found"));
        requireOwnership(plan.getFreelancerId());
        if (plan.getStatus() == SubscriptionPlan.PlanStatus.DELETED) {
            throw new BadRequestException("Plan is already deleted");
        }

        // Block deletion when any client is actively subscribed to this plan
        long activeSubscribers = subscriptionRepository
                .countByPlanIdAndStatus(planId, Subscription.SubscriptionStatus.ACTIVE);
        if (activeSubscribers > 0) {
            throw new BadRequestException(
                    "Cannot delete plan: " + activeSubscribers + " active subscriber(s). " +
                    "Pause the plan to stop new subscriptions, or wait for all subscribers to cancel.");
        }

        plan.setStatus(SubscriptionPlan.PlanStatus.DELETED);
        planRepository.saveAndFlush(plan);
    }

    private SubscriptionPlan findEditablePlan(Long planId) {
        SubscriptionPlan plan = planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription plan " + planId + " not found"));
        if (plan.getStatus() == SubscriptionPlan.PlanStatus.DELETED) {
            throw new ResourceNotFoundException("Subscription plan " + planId + " not found");
        }
        return plan;
    }

    private void requireOwnership(Long planFreelancerId) {
        Long currentUserId = currentUserResolver.getCurrentUserId();
        if (!currentUserId.equals(planFreelancerId)) {
            throw new ForbiddenException("You can only modify your own subscription plans");
        }
    }

    private void saveFeatures(Long planId, List<FeatureItem> features) {
        for (FeatureItem item : features) {
            SubscriptionFeature feature = new SubscriptionFeature();
            feature.setPlanId(planId);
            feature.setFeatureName(item.getFeatureName());
            feature.setFeatureValue(item.getFeatureValue());
            featureRepository.save(feature);
        }
    }

    private SubscriptionPlanResponse toResponse(SubscriptionPlan plan) {
        List<FeatureResponse> features = featureRepository.findByPlanId(plan.getId()).stream()
                .map(f -> FeatureResponse.builder()
                        .id(f.getId()).featureName(f.getFeatureName()).featureValue(f.getFeatureValue())
                        .build())
                .toList();
        return SubscriptionPlanResponse.builder()
                .id(plan.getId()).freelancerId(plan.getFreelancerId())
                .planName(plan.getPlanName()).price(plan.getPrice())
                .billingCycle(plan.getBillingCycle()).description(plan.getDescription())
                .status(plan.getStatus()).features(features)
                .createdAt(plan.getCreatedAt()).updatedAt(plan.getUpdatedAt())
                .build();
    }
}
