package com.fusion5.skillasaservice.auth_service.service;

import com.fusion5.skillasaservice.auth_service.dto.EmailEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailProducer {

    private final RabbitTemplate rabbitTemplate;

    @Value("${rabbitmq.exchange}")
    private String exchange;

    @Value("${rabbitmq.routing.email}")
    private String emailRoutingKey;

    public void sendEmailEvent(EmailEvent emailEvent) {
        log.info("Publishing email event to queue for: {}", emailEvent.getToEmail());
        rabbitTemplate.convertAndSend(exchange, emailRoutingKey, emailEvent);
    }
}