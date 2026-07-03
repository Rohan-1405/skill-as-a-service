package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;

@Data
public class CertificationRequest {
    @NotBlank(message = "Title is required")
    private String title;
    @NotBlank(message = "Issuer is required")
    private String issuer;
    private String credentialId;
    private LocalDate issueDate;
    private LocalDate expiryDate;
    private String credentialUrl;
}
