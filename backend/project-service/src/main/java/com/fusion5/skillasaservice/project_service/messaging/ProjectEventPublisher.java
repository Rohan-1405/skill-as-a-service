package com.fusion5.skillasaservice.project_service.messaging;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
@Component @RequiredArgsConstructor @Slf4j
public class ProjectEventPublisher {
    private final RabbitTemplate rabbitTemplate;
    @Value("${project.rabbitmq.exchange}") private String exchange;
    @Value("${project.rabbitmq.routing-key.team-created}") private String teamCreatedKey;
    @Value("${project.rabbitmq.routing-key.team-invite}") private String teamInviteKey;

    public void publishTeamCreated(ProjectTeamCreatedEvent event) {
        rabbitTemplate.convertAndSend(exchange, teamCreatedKey, event);
        log.info("Published TeamCreatedEvent for project {}", event.getProjectId());
    }

    /** Fires when a user is invited to a team. NotificationEvent.userId may be null if the
     *  invited email isn't a registered user yet — caller should skip publishing in that case. */
    public void publishTeamInvite(NotificationEvent event) {
        rabbitTemplate.convertAndSend(exchange, teamInviteKey, event);
        log.info("Published NotificationEvent (team invite) for user {}", event.getUserId());
    }
}
