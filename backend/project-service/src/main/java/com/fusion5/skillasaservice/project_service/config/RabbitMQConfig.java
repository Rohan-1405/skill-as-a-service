package com.fusion5.skillasaservice.project_service.config;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
@Configuration
public class RabbitMQConfig {
    @Value("${project.rabbitmq.exchange}") private String exchange;
    @Bean public TopicExchange projectExchange() { return new TopicExchange(exchange); }
    @Bean public Jackson2JsonMessageConverter messageConverter() { return new Jackson2JsonMessageConverter(); }
    @Bean public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate t = new RabbitTemplate(connectionFactory);
        t.setMessageConverter(messageConverter()); return t;
    }
}
