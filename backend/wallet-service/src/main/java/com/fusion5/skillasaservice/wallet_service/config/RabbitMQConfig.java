package com.fusion5.skillasaservice.wallet_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    // Shared topic exchange - all services publish/consume here
    public static final String EXCHANGE = "saas.topic.exchange";

    // wallet-service's own queue - binds to payment.completed routing key
    public static final String WALLET_PAYMENT_QUEUE = "wallet.payment.completed";
    public static final String PAYMENT_COMPLETED_KEY = "payment.completed";

    @Bean
    public TopicExchange saasTopicExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    @Bean
    public Queue walletPaymentQueue() {
        return QueueBuilder.durable(WALLET_PAYMENT_QUEUE).build();
    }

    @Bean
    public Binding walletPaymentBinding(Queue walletPaymentQueue, TopicExchange saasTopicExchange) {
        return BindingBuilder.bind(walletPaymentQueue)
                .to(saasTopicExchange)
                .with(PAYMENT_COMPLETED_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(messageConverter());
        return template;
    }
}
