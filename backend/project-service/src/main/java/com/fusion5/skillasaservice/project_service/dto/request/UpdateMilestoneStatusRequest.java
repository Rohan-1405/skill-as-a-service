package com.fusion5.skillasaservice.project_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateMilestoneStatusRequest {
    @NotBlank(message = "status is required (PENDING, IN_PROGRESS, or COMPLETED)")
    private String status;
}
