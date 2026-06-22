package com.fusion5.skillasaservice.subscription_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "saas.topic.exchange";
    public static final String SUBSCRIPTION_PAYMENT_QUEUE = "subscription.payment.completed";
    public static final String PAYMENT_COMPLETED_KEY = "payment.completed";

    @Bean
    public TopicExchange saasTopicExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    @Bean
    public Queue subscriptionPaymentQueue() {
        return QueueBuilder.durable(SUBSCRIPTION_PAYMENT_QUEUE).build();
    }

    @Bean
    public Binding subscriptionPaymentBinding(Queue subscriptionPaymentQueue,
                                               TopicExchange saasTopicExchange) {
        return BindingBuilder.bind(subscriptionPaymentQueue)
                .to(saasTopicExchange)
                .with(PAYMENT_COMPLETED_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory cf) {
        RabbitTemplate t = new RabbitTemplate(cf);
        t.setMessageConverter(messageConverter());
        return t;
    }
}
