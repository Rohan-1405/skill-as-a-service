package com.fusion5.skillasaservice.auth_service.dto.response;

import lombok.*;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;

    @Builder.Default
    private String tokenType = "Bearer";

    private String userId;
    private String email;
    private List<String> roles;
    private String message;
}