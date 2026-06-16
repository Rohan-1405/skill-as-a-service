package com.fusion5.skillasaservice.user_service.dto.request;

import jakarta.validation.constraints.Email;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UpdateUserRequest {
    private String firstName;
    private String lastName;

    @Email(message = "Invalid email format")
    private String email;

    private String mobile;
    private String profileImage;
    private String status; // ACTIVE, INACTIVE, SUSPENDED, BLOCKED
}
