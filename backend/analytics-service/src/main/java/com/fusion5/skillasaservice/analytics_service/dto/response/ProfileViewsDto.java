package com.fusion5.skillasaservice.analytics_service.dto.response;

import lombok.Builder;
import lombok.Data;

/** profileViews is a cumulative counter column on freelancer_profiles — no daily/weekly
 *  time-series exists anywhere in the platform, so this is a single running total only. */
@Data @Builder
public class ProfileViewsDto {
    private long profileViews;
}
