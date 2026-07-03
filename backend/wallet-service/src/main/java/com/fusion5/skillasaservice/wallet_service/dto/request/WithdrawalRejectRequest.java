package com.fusion5.skillasaservice.wallet_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WithdrawalRejectRequest {
    @NotBlank(message = "reason is required")
    private String reason;
}
