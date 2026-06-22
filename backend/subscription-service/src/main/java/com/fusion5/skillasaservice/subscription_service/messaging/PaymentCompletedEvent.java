package com.fusion5.skillasaservice.subscription_service.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCompletedEvent {
    private Long paymentId;
    private Long subscriptionId;
    private Long clientId;
    private Long freelancerId;
    private BigDecimal amount;
    private String razorpayPaymentId;
    private String razorpayOrderId;
}
