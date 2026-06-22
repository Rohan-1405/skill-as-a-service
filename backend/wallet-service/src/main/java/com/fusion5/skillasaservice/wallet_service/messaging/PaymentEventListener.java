package com.fusion5.skillasaservice.wallet_service.messaging;

import com.fusion5.skillasaservice.wallet_service.config.RabbitMQConfig;
import com.fusion5.skillasaservice.wallet_service.service.WalletService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);

    private final WalletService walletService;

    public PaymentEventListener(WalletService walletService) {
        this.walletService = walletService;
    }

    @RabbitListener(queues = RabbitMQConfig.WALLET_PAYMENT_QUEUE)
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Wallet: received payment.completed for subscriptionId={} freelancerId={} amount={}",
                event.getSubscriptionId(), event.getFreelancerId(), event.getAmount());
        try {
            walletService.creditFreelancerWallet(event);
            log.info("Wallet: credited freelancer {} successfully", event.getFreelancerId());
        } catch (Exception e) {
            log.error("Wallet: failed to credit freelancer {} - {}", event.getFreelancerId(), e.getMessage());
            // In production this would go to a dead-letter queue; for now just log
        }
    }
}
