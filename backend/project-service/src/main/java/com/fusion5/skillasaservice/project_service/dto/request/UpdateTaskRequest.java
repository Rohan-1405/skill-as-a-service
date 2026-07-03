package com.fusion5.skillasaservice.project_service.dto.request;
import lombok.Data;
import java.time.LocalDate;
@Data
public class UpdateTaskRequest {
    private String title;
    private String description;
    private Long milestoneId;
    private Long assignedTo;
    private String priority;
    private LocalDate dueDate;
}
