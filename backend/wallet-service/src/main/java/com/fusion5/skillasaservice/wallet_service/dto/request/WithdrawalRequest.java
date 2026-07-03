package com.fusion5.skillasaservice.wallet_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class WithdrawalRequest {
    @NotNull @Positive(message = "amount must be positive")
    private BigDecimal amount;
    @NotBlank(message = "payoutMethod is required (UPI, BANK_TRANSFER, PAYPAL, WISE)")
    private String payoutMethod;
    @NotBlank(message = "payoutDetails is required (UPI ID, account number, email, etc.)")
    private String payoutDetails;
}
