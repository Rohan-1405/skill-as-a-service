package com.fusion5.skillasaservice.subscription_service.controller;

import com.fusion5.skillasaservice.subscription_service.dto.request.PlanChangeRequest;
import com.fusion5.skillasaservice.subscription_service.dto.request.PurchaseSubscriptionRequest;
import com.fusion5.skillasaservice.subscription_service.dto.response.PurchaseInitiatedResponse;
import com.fusion5.skillasaservice.subscription_service.dto.response.SubscriptionResponse;
import com.fusion5.skillasaservice.subscription_service.entity.Subscription;
import com.fusion5.skillasaservice.subscription_service.service.SubscriptionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    // ── Existing endpoints (unchanged) ────────────────────────────────────────

    @PostMapping("/purchase")
    @PreAuthorize("hasRole('CLIENT')")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public PurchaseInitiatedResponse purchase(
            @Valid @RequestBody PurchaseSubscriptionRequest request,
            HttpServletRequest httpRequest) {
        String authHeader = httpRequest.getHeader("Authorization");
        return subscriptionService.purchase(request, authHeader);
    }

    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CLIENT')")
    public SubscriptionResponse cancel(@PathVariable Long id) {
        return subscriptionService.cancel(id);
    }

    @GetMapping("/my/client")
    @PreAuthorize("hasRole('CLIENT')")
    public List<SubscriptionResponse> mySubscriptionsAsClient() {
        return subscriptionService.getMySubscriptionsAsClient();
    }

    @GetMapping("/my/freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public List<SubscriptionResponse> mySubscriptionsAsFreelancer() {
        return subscriptionService.getMySubscriptionsAsFreelancer();
    }

    // ── Gap #16: Upgrade subscription plan ───────────────────────────────────
    // CLIENT moves to a higher-priced plan by the same freelancer.
    // Plan swaps immediately; billing adjusts at next renewal_date.
    @PatchMapping("/{id}/upgrade")
    @PreAuthorize("hasRole('CLIENT')")
    public SubscriptionResponse upgrade(
            @PathVariable Long id,
            @Valid @RequestBody PlanChangeRequest request) {
        return subscriptionService.upgrade(id, request.getNewPlanId());
    }

    // ── Gap #17: Downgrade subscription plan ─────────────────────────────────
    // CLIENT moves to a lower-priced plan by the same freelancer.
    // Plan swaps immediately; billing adjusts at next renewal_date.
    @PatchMapping("/{id}/downgrade")
    @PreAuthorize("hasRole('CLIENT')")
    public SubscriptionResponse downgrade(
            @PathVariable Long id,
            @Valid @RequestBody PlanChangeRequest request) {
        return subscriptionService.downgrade(id, request.getNewPlanId());
    }

    // ── Gap #20: Subscription history (all statuses, paginated) ──────────────
    @GetMapping("/history")
    public Page<Subscription> history(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return subscriptionService.getHistory(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }
}
