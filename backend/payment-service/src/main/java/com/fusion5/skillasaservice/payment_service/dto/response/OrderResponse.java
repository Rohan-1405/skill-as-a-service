package com.fusion5.skillasaservice.payment_service.dto.response;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
@Data @Builder
public class OrderResponse {
    private Long paymentId;
    private Long subscriptionId;
    private String razorpayOrderId;
    private BigDecimal amount;
    private String currency;
    private String status;
}
