package com.fusion5.skillasaservice.project_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class UpdateProjectStatusRequest {
    @NotBlank(message = "status is required: DRAFT, ACTIVE, REVIEW, COMPLETED, CANCELLED")
    private String status;
}
