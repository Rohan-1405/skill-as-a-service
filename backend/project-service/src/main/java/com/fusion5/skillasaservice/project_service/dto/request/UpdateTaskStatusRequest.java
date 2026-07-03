package com.fusion5.skillasaservice.project_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class UpdateTaskStatusRequest {
    @NotBlank(message = "status is required: TODO, IN_PROGRESS, REVIEW, DONE") private String status;
}
