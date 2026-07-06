package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class SubscriberSummaryDto {
    private long activeSubscribers;   // distinct clients with an ACTIVE subscription
    private List<StatusCountDto> byStatus;
}
