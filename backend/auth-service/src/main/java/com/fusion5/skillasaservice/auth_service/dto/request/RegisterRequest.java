package com.fusion5.skillasaservice.auth_service.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @Pattern(regexp = "^[0-9]{10}$", message = "Valid 10-digit mobile number required")
    private String mobile;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank(message = "Role is required")
    private String role;
}