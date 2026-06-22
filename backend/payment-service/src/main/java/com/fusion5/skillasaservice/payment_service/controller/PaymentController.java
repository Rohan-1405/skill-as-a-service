package com.fusion5.skillasaservice.payment_service.controller;

import com.fusion5.skillasaservice.payment_service.dto.request.CreateOrderRequest;
import com.fusion5.skillasaservice.payment_service.dto.request.VerifyPaymentRequest;
import com.fusion5.skillasaservice.payment_service.dto.response.InvoiceResponse;
import com.fusion5.skillasaservice.payment_service.dto.response.OrderResponse;
import com.fusion5.skillasaservice.payment_service.dto.response.PaymentResponse;
import com.fusion5.skillasaservice.payment_service.service.InvoiceService;
import com.fusion5.skillasaservice.payment_service.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final InvoiceService invoiceService;

    public PaymentController(PaymentService paymentService, InvoiceService invoiceService) {
        this.paymentService = paymentService;
        this.invoiceService = invoiceService;
    }

    // Day 8 - Payment Service APIs
    // Called by subscription-service (Feign) to create Razorpay order. Also callable directly.
    @PostMapping("/orders")
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse createOrder(@Valid @RequestBody CreateOrderRequest request) {
        return paymentService.createOrder(request);
    }

    // Step 2: client sends Razorpay callback details for server-side verification
    @PostMapping("/verify")
    public PaymentResponse verifyPayment(@Valid @RequestBody VerifyPaymentRequest request) {
        return paymentService.verifyPayment(request);
    }

    // Client's own payment history
    @GetMapping("/history")
    public List<PaymentResponse> getMyPayments() {
        return paymentService.getMyPayments();
    }

    // Day 8 - Invoice APIs
    @GetMapping("/invoices")
    public List<InvoiceResponse> getMyInvoices() {
        return invoiceService.getMyInvoices();
    }

    @GetMapping("/invoices/{id}")
    public InvoiceResponse getInvoice(@PathVariable Long id) {
        return invoiceService.getInvoice(id);
    }
}
