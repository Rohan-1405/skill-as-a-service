package com.fusion5.skillasaservice.notification_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends plain-text email via SMTP. Failures are logged and swallowed — a broken mail
 * server should never prevent the in-app notification from being saved. Configure
 * spring.mail.* in application.properties (SMTP host/port/username/password) or point
 * at Amazon SES's SMTP interface, per the tech stack.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${notification.email.from:no-reply@skillasaservice.com}")
    private String fromAddress;

    /** Returns true if the send appeared to succeed, false otherwise (never throws). */
    public boolean send(String toEmail, String subject, String body) {
        if (toEmail == null || toEmail.isBlank()) {
            log.warn("Skipping email — no address on file for this user");
            return false;
        }
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromAddress);
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
            return true;
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            return false;
        }
    }
}
