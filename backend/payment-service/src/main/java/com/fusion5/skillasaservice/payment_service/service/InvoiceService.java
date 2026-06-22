package com.fusion5.skillasaservice.payment_service.service;

import com.fusion5.skillasaservice.payment_service.dto.response.InvoiceResponse;
import com.fusion5.skillasaservice.payment_service.entity.Invoice;
import com.fusion5.skillasaservice.payment_service.entity.Payment;
import com.fusion5.skillasaservice.payment_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.payment_service.repository.InvoiceRepository;
import com.fusion5.skillasaservice.payment_service.security.CurrentUserResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final CurrentUserResolver currentUserResolver;

    @Value("${app.tax.gst.percentage:18}")
    private int gstPercentage;

    @Value("${app.invoice.prefix:INV}")
    private String invoicePrefix;

    public InvoiceService(InvoiceRepository invoiceRepository,
                           CurrentUserResolver currentUserResolver) {
        this.invoiceRepository = invoiceRepository;
        this.currentUserResolver = currentUserResolver;
    }

    /**
     * Called internally by PaymentService after a successful payment verification.
     * The subscription price is treated as the subtotal (exclusive of GST).
     * Tax = subtotal * gstPercentage / 100. Total = subtotal + tax.
     */
    public Invoice generateInvoice(Payment payment) {
        BigDecimal subtotal = payment.getAmount();
        BigDecimal tax = subtotal
                .multiply(BigDecimal.valueOf(gstPercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal total = subtotal.add(tax);

        Invoice invoice = new Invoice();
        invoice.setPaymentId(payment.getId());
        invoice.setSubscriptionId(payment.getSubscriptionId());
        invoice.setClientId(payment.getPayerId());
        invoice.setFreelancerId(payment.getPayeeId());
        invoice.setSubtotal(subtotal);
        invoice.setTaxAmount(tax);
        invoice.setTotalAmount(total);

        // Invoice number: INV-YYYYMMDD-{paymentId}, e.g. INV-20260618-42
        String invoiceNumber = invoicePrefix + "-"
                + java.time.LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"))
                + "-" + payment.getId();
        invoice.setInvoiceNumber(invoiceNumber);

        return invoiceRepository.save(invoice);
    }

    public InvoiceResponse getInvoice(Long invoiceId) {
        Invoice invoice = invoiceRepository.findById(invoiceId)
                .orElseThrow(() -> new ResourceNotFoundException("Invoice " + invoiceId + " not found"));
        Long currentUserId = currentUserResolver.getCurrentUserId();
        // Only the client or the freelancer on the invoice can view it
        if (!invoice.getClientId().equals(currentUserId) && !invoice.getFreelancerId().equals(currentUserId)) {
            throw new ResourceNotFoundException("Invoice " + invoiceId + " not found");
        }
        return toResponse(invoice);
    }

    public List<InvoiceResponse> getMyInvoices() {
        Long userId = currentUserResolver.getCurrentUserId();
        // Return invoices where current user is either client or freelancer
        List<Invoice> clientInvoices = invoiceRepository.findByClientIdOrderByCreatedAtDesc(userId);
        List<Invoice> freelancerInvoices = invoiceRepository.findByFreelancerIdOrderByCreatedAtDesc(userId);
        // Merge and deduplicate (a user can be both client on one invoice and freelancer on another)
        return java.util.stream.Stream.concat(clientInvoices.stream(), freelancerInvoices.stream())
                .distinct()
                .map(this::toResponse)
                .toList();
    }

    private InvoiceResponse toResponse(Invoice i) {
        return InvoiceResponse.builder()
                .id(i.getId()).paymentId(i.getPaymentId()).subscriptionId(i.getSubscriptionId())
                .clientId(i.getClientId()).freelancerId(i.getFreelancerId())
                .invoiceNumber(i.getInvoiceNumber()).subtotal(i.getSubtotal())
                .taxAmount(i.getTaxAmount()).totalAmount(i.getTotalAmount())
                .createdAt(i.getCreatedAt())
                .build();
    }
}
