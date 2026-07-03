package com.fusion5.skillasaservice.notification_service.messaging;

import com.fusion5.skillasaservice.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = "${notification.rabbitmq.queue}")
    public void onNotificationEvent(NotificationEvent event) {
        try {
            if (event.getUserId() == null || event.getTitle() == null || event.getMessage() == null) {
                log.warn("Dropping malformed NotificationEvent: {}", event);
                return;
            }
            notificationService.create(
                    event.getUserId(), event.getTitle(), event.getMessage(),
                    event.getType(), event.isSendEmail());
        } catch (Exception e) {
            // Never let a bad event crash the listener thread — log and move on.
            log.error("Failed to process NotificationEvent for user {}: {}",
                    event.getUserId(), e.getMessage());
        }
    }
}
