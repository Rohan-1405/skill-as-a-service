package com.fusion5.skillasaservice.payment_service.dto.response;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;
@Data @Builder
public class InvoiceResponse {
    private Long id;
    private Long paymentId;
    private Long subscriptionId;
    private Long clientId;
    private Long freelancerId;
    private String invoiceNumber;
    private BigDecimal subtotal;
    private BigDecimal taxAmount;
    private BigDecimal totalAmount;
    private LocalDateTime createdAt;
}
