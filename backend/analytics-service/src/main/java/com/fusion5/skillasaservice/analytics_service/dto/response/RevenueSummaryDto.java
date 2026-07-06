package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class RevenueSummaryDto {
    private BigDecimal totalRevenue;    // sum of COMPLETED payments
    private BigDecimal totalRefunded;   // sum of COMPLETED refunds
    private BigDecimal netRevenue;      // totalRevenue - totalRefunded
    private List<MonthlyAmountDto> monthlyTrend;
}
