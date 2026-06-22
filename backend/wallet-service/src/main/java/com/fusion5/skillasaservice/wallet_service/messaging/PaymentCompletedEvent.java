package com.fusion5.skillasaservice.wallet_service.messaging;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

/**
 * Event published by payment-service after a Razorpay payment is verified.
 * Consumed by:
 *   - wallet-service  → credits the freelancer's wallet (amount minus platform fee)
 *   - subscription-service → activates the subscription (PENDING → ACTIVE)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentCompletedEvent {
    private Long paymentId;
    private Long subscriptionId;
    private Long clientId;
    private Long freelancerId;
    private BigDecimal amount;          // full subscription price
    private String razorpayPaymentId;
    private String razorpayOrderId;
}
