package com.fusion5.skillasaservice.chat_service.messaging;
import lombok.Data;
import java.util.List;
@Data
public class ProjectTeamCreatedEvent {
    private Long projectId;
    private String projectName;
    private Long teamId;
    private Long ownerId;
    private List<Long> memberUserIds;   // all team member user IDs to add to group room
}
