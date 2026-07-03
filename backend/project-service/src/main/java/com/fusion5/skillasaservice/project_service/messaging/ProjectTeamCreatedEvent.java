package com.fusion5.skillasaservice.project_service.messaging;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class ProjectTeamCreatedEvent {
    private Long projectId;
    private String projectName;
    private Long teamId;
    private Long ownerId;
    private List<Long> memberUserIds;
}
