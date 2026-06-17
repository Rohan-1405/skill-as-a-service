package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class UpdateSkillsRequest {

    @NotNull(message = "skillIds is required (send an empty list to clear all skills)")
    private List<Long> skillIds;
}
