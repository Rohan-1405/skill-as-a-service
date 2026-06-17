package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateSkillRequest {

    @NotBlank(message = "skillName is required")
    private String skillName;
}
