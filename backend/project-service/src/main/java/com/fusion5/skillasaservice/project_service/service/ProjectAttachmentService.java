package com.fusion5.skillasaservice.project_service.service;

import com.fusion5.skillasaservice.project_service.dto.request.AddAttachmentRequest;
import com.fusion5.skillasaservice.project_service.entity.ProjectAttachment;
import com.fusion5.skillasaservice.project_service.repository.ProjectAttachmentRepository;
import com.fusion5.skillasaservice.project_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectAttachmentService {

    private final ProjectAttachmentRepository attachmentRepository;
    private final ProjectService projectService;
    private final CurrentUserResolver currentUserResolver;

    /** Add attachment metadata to a project. Caller must have access (client or assigned freelancer). */
    @Transactional
    public ProjectAttachment add(Long projectId, AddAttachmentRequest req) {
        projectService.getById(projectId); // validates access, throws if not authorized
        ProjectAttachment a = new ProjectAttachment();
        a.setProjectId(projectId);
        a.setUploadedBy(currentUserResolver.getCurrentUserId());
        a.setFileUrl(req.getFileUrl());
        a.setFileName(req.getFileName());
        a.setFileType(req.getFileType());
        return attachmentRepository.saveAndFlush(a);
    }

    public List<ProjectAttachment> list(Long projectId) {
        projectService.getById(projectId); // validates access
        return attachmentRepository.findByProjectIdOrderByUploadedAtDesc(projectId);
    }
}
