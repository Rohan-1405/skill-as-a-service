package com.fusion5.skillasaservice.payment_service.dto.response;
import com.fusion5.skillasaservice.payment_service.entity.Payment;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data @Builder
public class PaymentResponse {
    private Long id;
    private Long payerId;
    private Long payeeId;
    private Long subscriptionId;
    private BigDecimal amount;
    private String currency;
    private String razorpayOrderId;
    private String razorpayPaymentId;
    private Payment.PaymentStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
