package com.fusion5.skillasaservice.notification_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${notification.rabbitmq.queue}") private String queue;
    @Value("${notification.rabbitmq.exchange}") private String exchange;
    @Value("${notification.rabbitmq.routing-key-pattern}") private String routingKeyPattern;

    @Bean public Queue notificationQueue() { return new Queue(queue, true); }

    @Bean public TopicExchange notificationExchange() { return new TopicExchange(exchange); }

    @Bean
    public Binding notificationBinding() {
        // Wildcard binding: catches notification.team.invite, notification.kyc.approved, etc.
        return BindingBuilder.bind(notificationQueue()).to(notificationExchange()).with(routingKeyPattern);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate t = new RabbitTemplate(connectionFactory);
        t.setMessageConverter(messageConverter());
        return t;
    }
}
