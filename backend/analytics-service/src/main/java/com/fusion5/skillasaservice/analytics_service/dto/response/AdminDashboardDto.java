package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;

@Data @Builder
public class AdminDashboardDto {
    private long totalUsers;
    private long totalFreelancers;
    private long totalClients;
    private long activeSubscriptions;
    private BigDecimal totalRevenue;
    private long pendingKyc;
    private long pendingWithdrawals;
    private long totalProjects;
}
