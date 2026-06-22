package com.fusion5.skillasaservice.subscription_service.controller;

import com.fusion5.skillasaservice.subscription_service.dto.request.PurchaseSubscriptionRequest;
import com.fusion5.skillasaservice.subscription_service.dto.response.PurchaseInitiatedResponse;
import com.fusion5.skillasaservice.subscription_service.dto.response.SubscriptionResponse;
import com.fusion5.skillasaservice.subscription_service.service.SubscriptionService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService subscriptionService;

    public SubscriptionController(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    // Day 6 - Purchase API
    // CLIENT calls this to subscribe to a freelancer's plan.
    // Returns 202 (not 201) - subscription is PENDING until payment is verified.
    @PostMapping("/purchase")
    @PreAuthorize("hasRole('CLIENT')")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public PurchaseInitiatedResponse purchase(
            @Valid @RequestBody PurchaseSubscriptionRequest request,
            HttpServletRequest httpRequest) {
        // Pass the Authorization header through to payment-service via Feign
        String authHeader = httpRequest.getHeader("Authorization");
        return subscriptionService.purchase(request, authHeader);
    }

    // Day 6 - Cancel API
    // CLIENT cancels their own ACTIVE subscription
    @PatchMapping("/{id}/cancel")
    @PreAuthorize("hasRole('CLIENT')")
    public SubscriptionResponse cancel(@PathVariable Long id) {
        return subscriptionService.cancel(id);
    }

    // Client's own subscriptions (all statuses)
    @GetMapping("/my/client")
    @PreAuthorize("hasRole('CLIENT')")
    public List<SubscriptionResponse> mySubscriptionsAsClient() {
        return subscriptionService.getMySubscriptionsAsClient();
    }

    // Freelancer's incoming subscriptions (who has subscribed to my plans)
    @GetMapping("/my/freelancer")
    @PreAuthorize("hasRole('FREELANCER')")
    public List<SubscriptionResponse> mySubscriptionsAsFreelancer() {
        return subscriptionService.getMySubscriptionsAsFreelancer();
    }
}
