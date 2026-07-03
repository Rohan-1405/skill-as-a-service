package com.fusion5.skillasaservice.payment_service.service;

import com.fusion5.skillasaservice.payment_service.dto.request.RefundRequest;
import com.fusion5.skillasaservice.payment_service.entity.Payment;
import com.fusion5.skillasaservice.payment_service.entity.Refund;
import com.fusion5.skillasaservice.payment_service.exception.BadRequestException;
import com.fusion5.skillasaservice.payment_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.payment_service.repository.PaymentRepository;
import com.fusion5.skillasaservice.payment_service.repository.RefundRepository;
import com.fusion5.skillasaservice.payment_service.security.CurrentUserResolver;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONObject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefundService {

    private final RefundRepository    refundRepository;
    private final PaymentRepository   paymentRepository;
    private final RazorpayClient      razorpayClient;
    private final CurrentUserResolver currentUserResolver;

    @Transactional
    public Refund initiateRefund(RefundRequest req) {
        Long initiatorId = currentUserResolver.getCurrentUserId();

        Payment payment = paymentRepository.findById(req.getPaymentId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found: " + req.getPaymentId()));

        if (payment.getStatus() != Payment.PaymentStatus.COMPLETED) {
            throw new BadRequestException("Only COMPLETED payments can be refunded (current status: " + payment.getStatus() + ")");
        }
        if (req.getAmount().compareTo(payment.getAmount()) > 0) {
            throw new BadRequestException("Refund amount cannot exceed payment amount of " + payment.getAmount());
        }

        Refund refund = new Refund();
        refund.setPaymentId(payment.getId());
        refund.setRazorpayPaymentId(payment.getRazorpayPaymentId());
        refund.setAmount(req.getAmount());
        refund.setReason(req.getReason());
        refund.setInitiatedBy(initiatorId);
        refund.setStatus(Refund.RefundStatus.PROCESSING);
        refund = refundRepository.save(refund);

        // Call Razorpay refund API
        try {
            long amountInPaise = req.getAmount()
                    .multiply(BigDecimal.valueOf(100))
                    .longValue();

            JSONObject refundReq = new JSONObject();
            refundReq.put("amount", amountInPaise);
            if (req.getReason() != null) {
                refundReq.put("notes", new JSONObject().put("reason", req.getReason()));
            }

            com.razorpay.Refund rzpRefund =
                    razorpayClient.payments.refund(payment.getRazorpayPaymentId(), refundReq);

            refund.setRazorpayRefundId(rzpRefund.get("id"));
            refund.setStatus(Refund.RefundStatus.COMPLETED);

            // Mark original payment as refunded
            payment.setStatus(Payment.PaymentStatus.REFUNDED);
            paymentRepository.saveAndFlush(payment);

            log.info("Refund {} completed for payment {}", refund.getRazorpayRefundId(), payment.getId());

        } catch (RazorpayException e) {
            refund.setStatus(Refund.RefundStatus.FAILED);
            refund.setFailureReason(e.getMessage());
            log.error("Razorpay refund failed for payment {}: {}", payment.getId(), e.getMessage());
        }

        return refundRepository.saveAndFlush(refund);
    }

    public Page<Refund> listAll(Pageable pageable) {
        return refundRepository.findAll(pageable);
    }

    public Refund getById(Long id) {
        return refundRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Refund not found: " + id));
    }
}
