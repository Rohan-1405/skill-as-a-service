package com.fusion5.skillasaservice.profile_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class KycRejectRequest {
    @NotBlank(message = "reason is required")
    private String reason;
}
