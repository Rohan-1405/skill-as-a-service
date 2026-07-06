package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import java.math.BigDecimal;

@Data @AllArgsConstructor
public class StatusCountAmountDto {
    private String status;
    private long count;
    private BigDecimal amount;
}
