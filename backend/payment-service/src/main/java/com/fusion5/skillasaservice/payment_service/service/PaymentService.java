package com.fusion5.skillasaservice.payment_service.service;

import com.fusion5.skillasaservice.payment_service.config.RabbitMQConfig;
import com.fusion5.skillasaservice.payment_service.dto.request.CreateOrderRequest;
import com.fusion5.skillasaservice.payment_service.dto.request.VerifyPaymentRequest;
import com.fusion5.skillasaservice.payment_service.dto.response.OrderResponse;
import com.fusion5.skillasaservice.payment_service.dto.response.PaymentResponse;
import com.fusion5.skillasaservice.payment_service.entity.Payment;
import com.fusion5.skillasaservice.payment_service.exception.BadRequestException;
import com.fusion5.skillasaservice.payment_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.payment_service.messaging.PaymentCompletedEvent;
import com.fusion5.skillasaservice.payment_service.repository.PaymentRepository;
import com.fusion5.skillasaservice.payment_service.security.CurrentUserResolver;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HexFormat;
import java.util.List;

@Service
public class PaymentService {

    private static final Logger log = LoggerFactory.getLogger(PaymentService.class);

    private final PaymentRepository paymentRepository;
    private final RazorpayClient razorpayClient;
    private final RabbitTemplate rabbitTemplate;
    private final InvoiceService invoiceService;
    private final CurrentUserResolver currentUserResolver;

    // Injected via @Value in RazorpayConfig, but we need the secret for HMAC verification too
    // so we read it directly here from the application context
    @org.springframework.beans.factory.annotation.Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    public PaymentService(PaymentRepository paymentRepository,
                           RazorpayClient razorpayClient,
                           RabbitTemplate rabbitTemplate,
                           InvoiceService invoiceService,
                           CurrentUserResolver currentUserResolver) {
        this.paymentRepository = paymentRepository;
        this.razorpayClient = razorpayClient;
        this.rabbitTemplate = rabbitTemplate;
        this.invoiceService = invoiceService;
        this.currentUserResolver = currentUserResolver;
    }

    /**
     * Step 1 of the purchase flow.
     * Called by subscription-service (via REST/Feign) right after creating a PENDING subscription.
     * Creates a Razorpay order and returns the order_id to the client so they can open
     * the Razorpay checkout.
     */
    @Transactional
    public OrderResponse createOrder(CreateOrderRequest request) {
        Long clientId = currentUserResolver.getCurrentUserId();

        // Razorpay expects amount in paise (1 INR = 100 paise)
        int amountInPaise = request.getAmount()
                .multiply(BigDecimal.valueOf(100))
                .intValue();

        try {
            JSONObject orderRequest = new JSONObject();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "sub_" + request.getSubscriptionId());

            Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            // Persist a PENDING payment record so we can verify it later
            Payment payment = new Payment();
            payment.setPayerId(clientId);
            payment.setPayeeId(request.getFreelancerId());
            payment.setSubscriptionId(request.getSubscriptionId());
            payment.setAmount(request.getAmount());
            payment.setRazorpayOrderId(razorpayOrderId);
            payment.setStatus(Payment.PaymentStatus.PENDING);
            Payment saved = paymentRepository.saveAndFlush(payment);

            log.info("Razorpay order created: {} for subscriptionId={}", razorpayOrderId, request.getSubscriptionId());

            return OrderResponse.builder()
                    .paymentId(saved.getId())
                    .subscriptionId(request.getSubscriptionId())
                    .razorpayOrderId(razorpayOrderId)
                    .amount(request.getAmount())
                    .currency("INR")
                    .status("PENDING")
                    .build();

        } catch (RazorpayException e) {
            throw new BadRequestException("Failed to create Razorpay order: " + e.getMessage());
        }
    }

    /**
     * Step 2 of the purchase flow.
     * Client calls this after completing payment in the Razorpay checkout.
     * Verifies the HMAC signature, marks payment COMPLETED, generates invoice,
     * and publishes payment.completed to RabbitMQ (triggers subscription activation
     * in subscription-service and wallet credit in wallet-service).
     */
    @Transactional
    public PaymentResponse verifyPayment(VerifyPaymentRequest request) {
        Payment payment = paymentRepository.findByRazorpayOrderId(request.getRazorpayOrderId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No payment found for order: " + request.getRazorpayOrderId()));

        if (payment.getStatus() == Payment.PaymentStatus.COMPLETED) {
            throw new BadRequestException("Payment already verified");
        }

        // Razorpay signature verification: HMAC-SHA256(orderId + "|" + paymentId, keySecret)
        if (!isSignatureValid(request.getRazorpayOrderId(),
                               request.getRazorpayPaymentId(),
                               request.getRazorpaySignature())) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            paymentRepository.saveAndFlush(payment);
            throw new BadRequestException("Payment signature verification failed");
        }

        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setStatus(Payment.PaymentStatus.COMPLETED);
        Payment saved = paymentRepository.saveAndFlush(payment);

        // Auto-generate invoice
        invoiceService.generateInvoice(saved);

        // Publish event - subscription-service activates subscription,
        // wallet-service credits freelancer
        PaymentCompletedEvent event = new PaymentCompletedEvent(
                saved.getId(),
                saved.getSubscriptionId(),
                saved.getPayerId(),
                saved.getPayeeId(),
                saved.getAmount(),
                saved.getRazorpayPaymentId(),
                saved.getRazorpayOrderId()
        );
        rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE, RabbitMQConfig.PAYMENT_COMPLETED, event);
        log.info("Published payment.completed for subscriptionId={}", saved.getSubscriptionId());

        return toResponse(saved);
    }

    public List<PaymentResponse> getMyPayments() {
        Long clientId = currentUserResolver.getCurrentUserId();
        return paymentRepository.findByPayerIdOrderByCreatedAtDesc(clientId)
                .stream().map(this::toResponse).toList();
    }

    private boolean isSignatureValid(String orderId, String paymentId, String signature) {
        try {
            String payload = orderId + "|" + paymentId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(razorpayKeySecret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            byte[] hash = mac.doFinal(payload.getBytes(StandardCharsets.UTF_8));
            String generated = HexFormat.of().formatHex(hash);
            return generated.equals(signature);
        } catch (Exception e) {
            log.error("Signature verification error: {}", e.getMessage());
            return false;
        }
    }

    private PaymentResponse toResponse(Payment p) {
        return PaymentResponse.builder()
                .id(p.getId()).payerId(p.getPayerId()).payeeId(p.getPayeeId())
                .subscriptionId(p.getSubscriptionId()).amount(p.getAmount())
                .currency(p.getCurrency()).razorpayOrderId(p.getRazorpayOrderId())
                .razorpayPaymentId(p.getRazorpayPaymentId()).status(p.getStatus())
                .createdAt(p.getCreatedAt()).updatedAt(p.getUpdatedAt())
                .build();
    }
}
