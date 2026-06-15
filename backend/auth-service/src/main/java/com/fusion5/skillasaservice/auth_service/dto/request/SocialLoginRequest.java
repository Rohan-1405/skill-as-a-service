package com.fusion5.skillasaservice.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SocialLoginRequest {

    @NotBlank(message = "Provider is required")
    private String provider; // GOOGLE, FACEBOOK, GITHUB

    @NotBlank(message = "Access token is required")
    private String accessToken;

    /** Optional. CLIENT or FREELANCER. Defaults to CLIENT if not provided. */
    private String role;
}
