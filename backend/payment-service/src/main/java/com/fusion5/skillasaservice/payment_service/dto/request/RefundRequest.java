package com.fusion5.skillasaservice.payment_service.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class RefundRequest {
    @NotNull(message = "paymentId is required")
    private Long paymentId;
    @NotNull @Positive(message = "amount must be positive")
    private BigDecimal amount;
    private String reason;
}
