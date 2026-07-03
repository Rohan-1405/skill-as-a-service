package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class WorkExperienceRequest {
    @NotBlank(message = "Job title is required")
    private String jobTitle;
    @NotBlank(message = "Company is required")
    private String company;
    private String location;
    @NotNull(message = "Start date is required")
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean currentlyWorking;
    private String description;
}
