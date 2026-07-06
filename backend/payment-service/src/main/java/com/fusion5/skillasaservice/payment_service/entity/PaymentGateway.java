package com.fusion5.skillasaservice.payment_service.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

/**
 * Admin-managed config for a payment gateway (Stripe, PayPal, Razorpay, PayU, Cashfree,
 * PhonePe, Paytm, Flutterwave, Paystack, Authorize.net, Mercado Pago, Coinbase Commerce,
 * or a custom gateway — per BRD Module 4). Storing this in a table lets admins add/enable/
 * disable gateways at runtime instead of hardcoding one gateway (Razorpay) in application
 * properties, which is what payment-service actually does today for the live checkout flow.
 *
 * IMPORTANT CAVEAT: this table lets an admin catalog and toggle gateway configs, but nothing
 * in PaymentService/PaymentController currently reads from it to pick a gateway at checkout
 * time — the live Razorpay integration still uses the hardcoded razorpay.key.id/secret in
 * application.properties. Wiring checkout to actually select from this table (multi-gateway
 * routing) is a separate, larger change than "add admin CRUD for a gateway config" — flag
 * this to the user rather than implying multi-gateway checkout already works end-to-end.
 */
@Entity
@Table(name = "payment_gateways")
@Data
public class PaymentGateway {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "gateway_name", nullable = false, unique = true, length = 50)
    private String gatewayName;   // e.g. "razorpay", "stripe", "paypal" — used as a stable key

    @Column(name = "display_name", nullable = false, length = 100)
    private String displayName;   // e.g. "Razorpay (India)"

    @Column(name = "api_key", length = 500)
    private String apiKey;

    @Column(name = "api_secret", length = 500)
    private String apiSecret;

    @Column(name = "webhook_secret", length = 500)
    private String webhookSecret;

    /** Free-form JSON string for gateway-specific extra settings (e.g. currency, region). */
    @Lob
    @Column(columnDefinition = "TEXT")
    private String config;

    @Column(nullable = false)
    private boolean enabled = false;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
