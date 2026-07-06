package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data @AllArgsConstructor
public class MonthlyAmountDto {
    private String month;   // "2026-07"
    private BigDecimal amount;
}
