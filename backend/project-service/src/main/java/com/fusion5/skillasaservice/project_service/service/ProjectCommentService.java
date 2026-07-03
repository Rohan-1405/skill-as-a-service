package com.fusion5.skillasaservice.project_service.service;
import com.fusion5.skillasaservice.project_service.dto.request.CreateCommentRequest;
import com.fusion5.skillasaservice.project_service.entity.ProjectComment;
import com.fusion5.skillasaservice.project_service.repository.ProjectCommentRepository;
import com.fusion5.skillasaservice.project_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class ProjectCommentService {
    private final ProjectCommentRepository commentRepository;
    private final ProjectService projectService;
    private final CurrentUserResolver currentUserResolver;

    @Transactional
    public ProjectComment add(Long projectId, CreateCommentRequest req) {
        projectService.getById(projectId);
        Long userId = currentUserResolver.getCurrentUserId();
        ProjectComment c = new ProjectComment();
        c.setProjectId(projectId); c.setUserId(userId); c.setContent(req.getContent());
        return commentRepository.saveAndFlush(c);
    }

    public List<ProjectComment> list(Long projectId) {
        projectService.getById(projectId);
        return commentRepository.findByProjectIdOrderByCreatedAtAsc(projectId);
    }
}
