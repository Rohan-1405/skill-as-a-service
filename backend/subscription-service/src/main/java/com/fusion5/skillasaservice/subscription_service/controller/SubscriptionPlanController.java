package com.fusion5.skillasaservice.subscription_service.controller;

import com.fusion5.skillasaservice.subscription_service.dto.request.CreateSubscriptionPlanRequest;
import com.fusion5.skillasaservice.subscription_service.dto.request.UpdateSubscriptionPlanRequest;
import com.fusion5.skillasaservice.subscription_service.dto.response.SubscriptionPlanResponse;
import com.fusion5.skillasaservice.subscription_service.service.SubscriptionPlanService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions/plans")
public class SubscriptionPlanController {

    private final SubscriptionPlanService subscriptionPlanService;

    public SubscriptionPlanController(SubscriptionPlanService subscriptionPlanService) {
        this.subscriptionPlanService = subscriptionPlanService;
    }

    // US-SUB-01 - FREELANCER only, max 3 active plans enforced in the service layer
    @PostMapping
    @PreAuthorize("hasRole('FREELANCER')")
    @ResponseStatus(HttpStatus.CREATED)
    public SubscriptionPlanResponse createPlan(@Valid @RequestBody CreateSubscriptionPlanRequest request) {
        return subscriptionPlanService.createPlan(request);
    }

    // Public - viewing a single plan needs no login, same reasoning as GET /api/skills
    @GetMapping("/{id}")
    public SubscriptionPlanResponse getPlan(@PathVariable Long id) {
        return subscriptionPlanService.getPlan(id);
    }

    // Convenience endpoint (not in the original story) - the current freelancer's own plans,
    // any status. Declared as a literal path so it's matched before /{id} - see SecurityConfig.
    @GetMapping("/mine")
    @PreAuthorize("hasRole('FREELANCER')")
    public List<SubscriptionPlanResponse> listMyPlans() {
        return subscriptionPlanService.listMyPlans();
    }

    // US-SUB-02 - owner-only partial update; features list is fully replaced when provided
    @PutMapping("/{id}")
    public SubscriptionPlanResponse updatePlan(@PathVariable Long id,
                                                 @Valid @RequestBody UpdateSubscriptionPlanRequest request) {
        return subscriptionPlanService.updatePlan(id, request);
    }

    // US-SUB-03 - owner-only, only valid from ACTIVE; no resume endpoint (matches the story as written)
    @PatchMapping("/{id}/pause")
    public SubscriptionPlanResponse pausePlan(@PathVariable Long id) {
        return subscriptionPlanService.pausePlan(id);
    }

    // US-SUB-03 - owner-only soft delete
    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletePlan(@PathVariable Long id) {
        subscriptionPlanService.deletePlan(id);
    }
}
