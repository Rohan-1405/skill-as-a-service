package com.fusion5.skillasaservice.project_service.dto.request;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class UpdateMemberRoleRequest {
    @NotBlank(message = "role is required: ADMIN, MEMBER") private String role;
}
