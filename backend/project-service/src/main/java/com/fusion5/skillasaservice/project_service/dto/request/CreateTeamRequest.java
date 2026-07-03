package com.fusion5.skillasaservice.project_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class CreateTeamRequest {
    @NotBlank(message = "name is required") private String name;
}
