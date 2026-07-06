package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

@Data @Builder
public class EarningsSummaryDto {
    private BigDecimal totalEarnings;
    private long completedPaymentCount;
    private List<MonthlyAmountDto> monthlyTrend;   // last 6 months
}
