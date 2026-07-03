package com.fusion5.skillasaservice.auth_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TwoFaValidateRequest {

    @NotBlank(message = "twoFaTempToken is required")
    private String twoFaTempToken;

    @NotBlank(message = "TOTP code is required")
    private String code;
}
