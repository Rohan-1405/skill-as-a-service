package com.fusion5.skillasaservice.analytics_service.controller;

import com.fusion5.skillasaservice.analytics_service.dto.response.*;
import com.fusion5.skillasaservice.analytics_service.security.CurrentUserResolver;
import com.fusion5.skillasaservice.analytics_service.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final CurrentUserResolver currentUserResolver;

    // ── Freelancer ──────────────────────────────────────────────────────────

    @GetMapping("/api/analytics/freelancer/earnings")
    @PreAuthorize("hasRole('FREELANCER')")
    public ApiResponse<EarningsSummaryDto> freelancerEarnings() {
        Long id = currentUserResolver.getCurrentUserId();
        return ApiResponse.success("OK", analyticsService.freelancerEarnings(id));
    }

    @GetMapping("/api/analytics/freelancer/subscribers")
    @PreAuthorize("hasRole('FREELANCER')")
    public ApiResponse<SubscriberSummaryDto> freelancerSubscribers() {
        Long id = currentUserResolver.getCurrentUserId();
        return ApiResponse.success("OK", analyticsService.freelancerSubscribers(id));
    }

    @GetMapping("/api/analytics/freelancer/profile-views")
    @PreAuthorize("hasRole('FREELANCER')")
    public ApiResponse<ProfileViewsDto> freelancerProfileViews() {
        Long id = currentUserResolver.getCurrentUserId();
        return ApiResponse.success("OK", analyticsService.freelancerProfileViews(id));
    }

    @GetMapping("/api/analytics/freelancer/projects")
    @PreAuthorize("hasRole('FREELANCER')")
    public ApiResponse<ProjectStatsDto> freelancerProjects() {
        Long id = currentUserResolver.getCurrentUserId();
        return ApiResponse.success("OK", analyticsService.freelancerProjects(id));
    }

    // ── Client ──────────────────────────────────────────────────────────────

    @GetMapping("/api/analytics/client/subscriptions")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<ClientSubscriptionsDto> clientSubscriptions() {
        Long id = currentUserResolver.getCurrentUserId();
        return ApiResponse.success("OK", analyticsService.clientSubscriptions(id));
    }

    @GetMapping("/api/analytics/client/spending")
    @PreAuthorize("hasRole('CLIENT')")
    public ApiResponse<SpendingSummaryDto> clientSpending() {
        Long id = currentUserResolver.getCurrentUserId();
        return ApiResponse.success("OK", analyticsService.clientSpending(id));
    }

    // ── Admin ───────────────────────────────────────────────────────────────

    @GetMapping("/api/admin/analytics/revenue")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<RevenueSummaryDto> adminRevenue() {
        return ApiResponse.success("OK", analyticsService.adminRevenue());
    }

    @GetMapping("/api/admin/analytics/users")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<UserGrowthDto> adminUsers() {
        return ApiResponse.success("OK", analyticsService.adminUsers());
    }

    @GetMapping("/api/admin/analytics/kyc")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<KycStatsDto> adminKyc() {
        return ApiResponse.success("OK", analyticsService.adminKyc());
    }

    @GetMapping("/api/admin/analytics/transactions")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<TransactionStatsDto> adminTransactions() {
        return ApiResponse.success("OK", analyticsService.adminTransactions());
    }

    @GetMapping("/api/admin/analytics/dashboard")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ApiResponse<AdminDashboardDto> adminDashboard() {
        return ApiResponse.success("OK", analyticsService.adminDashboard());
    }
}
