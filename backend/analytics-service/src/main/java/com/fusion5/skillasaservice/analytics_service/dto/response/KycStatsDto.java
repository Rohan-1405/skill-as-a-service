package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data @Builder
public class KycStatsDto {
    private long pendingCount;
    private List<StatusCountDto> byStatus;

    /** Average hours between submittedAt and reviewedAt, across documents that HAVE been
     *  reviewed. Null if no documents have been reviewed yet (nothing to average). */
    private Double avgReviewTurnaroundHours;
}
