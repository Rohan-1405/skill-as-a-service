package com.fusion5.skillasaservice.subscription_service.dto.response;
import com.fusion5.skillasaservice.subscription_service.entity.Subscription;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;
@Data @Builder
public class SubscriptionResponse {
    private Long id;
    private Long clientId;
    private Long freelancerId;
    private Long planId;
    private String razorpayOrderId;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate renewalDate;
    private Subscription.SubscriptionStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
