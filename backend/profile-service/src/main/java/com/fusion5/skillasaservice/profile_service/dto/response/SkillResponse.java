package com.fusion5.skillasaservice.profile_service.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class SkillResponse {
    private Long id;
    private String skillName;
    private Boolean isActive;
}
