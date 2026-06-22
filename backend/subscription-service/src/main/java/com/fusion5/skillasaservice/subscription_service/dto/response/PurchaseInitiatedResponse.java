package com.fusion5.skillasaservice.subscription_service.dto.response;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
@Data @Builder
public class PurchaseInitiatedResponse {
    private Long subscriptionId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String message;
}
