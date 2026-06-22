package com.fusion5.skillasaservice.payment_service.dto.request;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;
@Data
public class CreateOrderRequest {
    @NotNull private Long subscriptionId;
    @NotNull private Long freelancerId;   // payee
    @NotNull @Positive private BigDecimal amount;
}
