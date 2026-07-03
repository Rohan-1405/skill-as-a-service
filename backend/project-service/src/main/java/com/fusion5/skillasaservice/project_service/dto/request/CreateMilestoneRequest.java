package com.fusion5.skillasaservice.project_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
@Data
public class CreateMilestoneRequest {
    @NotBlank(message = "title is required") private String title;
    private String description;
    private LocalDate dueDate;
}
