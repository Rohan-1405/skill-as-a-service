package com.fusion5.skillasaservice.project_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
@Data
public class CreateProjectRequest {
    @NotBlank(message = "title is required") private String title;
    private String description;
    private Long freelancerId;
    private LocalDate startDate;
    private LocalDate endDate;
}
