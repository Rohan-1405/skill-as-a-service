package com.fusion5.skillasaservice.project_service.dto.request;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
@Data
public class InviteMemberRequest {
    @NotBlank @Email(message = "valid email is required") private String email;
    private String role = "MEMBER";   // ADMIN or MEMBER (OWNER auto-assigned to creator)
}
