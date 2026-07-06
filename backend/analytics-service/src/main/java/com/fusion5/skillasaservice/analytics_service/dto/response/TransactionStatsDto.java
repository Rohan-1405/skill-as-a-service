package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class TransactionStatsDto {
    private List<StatusCountAmountDto> payments;
    private List<StatusCountAmountDto> refunds;
}
