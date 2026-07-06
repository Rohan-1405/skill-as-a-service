package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class UserGrowthDto {
    private long totalUsers;
    private long newLast30Days;
    private List<StatusCountDto> byStatus;
    private List<MonthlyCountDto> monthlyTrend;
}
