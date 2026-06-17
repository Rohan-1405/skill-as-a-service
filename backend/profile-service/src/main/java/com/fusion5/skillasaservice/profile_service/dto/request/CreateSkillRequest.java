package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateSkillRequest {

    @NotBlank(message = "skillName is required")
    private String skillName;
}
