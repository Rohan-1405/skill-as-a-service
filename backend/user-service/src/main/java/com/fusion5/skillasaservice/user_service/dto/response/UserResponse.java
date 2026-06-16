package com.fusion5.skillasaservice.user_service.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String uuid;
    private String firstName;
    private String lastName;
    private String email;
    private String mobile;
    private String profileImage;
    private String status;
    private Boolean emailVerified;
    private Boolean twoFaEnabled;
    private Set<String> roles;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
