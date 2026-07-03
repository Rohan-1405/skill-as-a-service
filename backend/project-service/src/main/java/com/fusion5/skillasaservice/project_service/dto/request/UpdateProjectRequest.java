package com.fusion5.skillasaservice.project_service.dto.request;
import lombok.Data;
import java.time.LocalDate;
@Data
public class UpdateProjectRequest {
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
}
