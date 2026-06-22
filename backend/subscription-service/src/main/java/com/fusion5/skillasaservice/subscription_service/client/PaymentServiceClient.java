package com.fusion5.skillasaservice.subscription_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;

/**
 * Feign client for payment-service.
 * subscription-service calls this synchronously to create a Razorpay order
 * immediately after creating a PENDING subscription — the client needs the
 * razorpayOrderId right away to open the Razorpay checkout.
 *
 * The Feign client passes the caller's JWT through to payment-service so
 * payment-service's CurrentUserResolver can identify the client correctly.
 */
@FeignClient(name = "payment-service")
public interface PaymentServiceClient {

    @PostMapping("/api/payment/orders")
    CreateOrderRequest.OrderResponse createOrder(
            @RequestHeader("Authorization") String bearerToken,
            @RequestBody CreateOrderRequest request);

    // Inner classes mirror the payment-service DTOs without needing a shared module
    class CreateOrderRequest {
        public Long subscriptionId;
        public Long freelancerId;
        public java.math.BigDecimal amount;

        public CreateOrderRequest(Long subscriptionId, Long freelancerId, java.math.BigDecimal amount) {
            this.subscriptionId = subscriptionId;
            this.freelancerId = freelancerId;
            this.amount = amount;
        }

        public static class OrderResponse {
            public Long paymentId;
            public Long subscriptionId;
            public String razorpayOrderId;
            public java.math.BigDecimal amount;
            public String currency;
            public String status;
        }
    }
}
