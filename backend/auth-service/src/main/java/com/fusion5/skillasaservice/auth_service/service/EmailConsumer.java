package com.fusion5.skillasaservice.auth_service.service;

import com.fusion5.skillasaservice.auth_service.dto.EmailEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @Value("${app.email.from}")
    private String fromEmail;

    @RabbitListener(queues = "${rabbitmq.queue.email}")
    public void handleEmailEvent(EmailEvent emailEvent) {
        log.info("Received email event for: {}", emailEvent.getToEmail());
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(emailEvent.getToEmail());
            message.setSubject(emailEvent.getSubject());
            message.setText(emailEvent.getBody());
            mailSender.send(message);
            log.info("Email sent successfully to: {}", emailEvent.getToEmail());
        } catch (Exception e) {
            log.error("Failed to send email to: {}. Error: {}", emailEvent.getToEmail(), e.getMessage());
        }
    }
}