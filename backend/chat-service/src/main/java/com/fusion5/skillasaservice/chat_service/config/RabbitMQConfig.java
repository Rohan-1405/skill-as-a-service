package com.fusion5.skillasaservice.chat_service.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    @Value("${chat.rabbitmq.queue}") private String queue;
    @Value("${chat.rabbitmq.exchange}") private String exchange;
    @Value("${chat.rabbitmq.routing-key}") private String routingKey;

    @Bean public Queue chatQueue() { return new Queue(queue, true); }

    @Bean public TopicExchange chatExchange() { return new TopicExchange(exchange); }

    @Bean
    public Binding chatBinding() {
        return BindingBuilder.bind(chatQueue()).to(chatExchange()).with(routingKey);
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
