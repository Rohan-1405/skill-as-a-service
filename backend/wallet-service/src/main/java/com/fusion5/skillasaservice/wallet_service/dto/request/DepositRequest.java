package com.fusion5.skillasaservice.wallet_service.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class DepositRequest {
    @NotNull(message = "amount is required")
    @DecimalMin(value = "1.00", message = "Minimum deposit is ₹1.00")
    private BigDecimal amount;
}
