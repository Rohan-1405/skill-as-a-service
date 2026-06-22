package com.fusion5.skillasaservice.subscription_service.messaging;

import com.fusion5.skillasaservice.subscription_service.config.RabbitMQConfig;
import com.fusion5.skillasaservice.subscription_service.service.SubscriptionService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
public class PaymentEventListener {

    private static final Logger log = LoggerFactory.getLogger(PaymentEventListener.class);

    private final SubscriptionService subscriptionService;

    public PaymentEventListener(SubscriptionService subscriptionService) {
        this.subscriptionService = subscriptionService;
    }

    @RabbitListener(queues = RabbitMQConfig.SUBSCRIPTION_PAYMENT_QUEUE)
    public void onPaymentCompleted(PaymentCompletedEvent event) {
        log.info("Subscription: received payment.completed for subscriptionId={}", event.getSubscriptionId());
        try {
            subscriptionService.activateSubscription(event);
        } catch (Exception e) {
            log.error("Subscription: failed to activate subscriptionId={} - {}",
                    event.getSubscriptionId(), e.getMessage());
        }
    }
}
