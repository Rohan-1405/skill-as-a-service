package com.fusion5.skillasaservice.project_service.service;

import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.entity.Project;
import com.fusion5.skillasaservice.project_service.entity.Project.ProjectStatus;
import com.fusion5.skillasaservice.project_service.exception.*;
import com.fusion5.skillasaservice.project_service.repository.ProjectRepository;
import com.fusion5.skillasaservice.project_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service @RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final CurrentUserResolver currentUserResolver;

    @Transactional
    public Project create(CreateProjectRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();
        Project p = new Project();
        p.setClientId(userId);
        p.setFreelancerId(req.getFreelancerId());
        p.setTitle(req.getTitle());
        p.setDescription(req.getDescription());
        p.setStartDate(req.getStartDate());
        p.setEndDate(req.getEndDate());
        p.setStatus(ProjectStatus.DRAFT);
        return projectRepository.saveAndFlush(p);
    }

    public Page<Project> myProjects(Pageable pageable) {
        Long userId = currentUserResolver.getCurrentUserId();
        return projectRepository.findByClientIdOrFreelancerId(userId, userId, pageable);
    }

    public Project getById(Long id) {
        Project p = find(id);
        requireAccess(p);
        return p;
    }

    @Transactional
    public Project update(Long id, UpdateProjectRequest req) {
        Project p = find(id);
        requireOwnerOrFreelancer(p);
        if (req.getTitle() != null)       p.setTitle(req.getTitle());
        if (req.getDescription() != null) p.setDescription(req.getDescription());
        if (req.getStartDate() != null)   p.setStartDate(req.getStartDate());
        if (req.getEndDate() != null)     p.setEndDate(req.getEndDate());
        return projectRepository.saveAndFlush(p);
    }

    @Transactional
    public Project updateStatus(Long id, UpdateProjectStatusRequest req) {
        Project p = find(id);
        requireOwnerOrFreelancer(p);
        ProjectStatus status;
        try { status = ProjectStatus.valueOf(req.getStatus().toUpperCase()); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + req.getStatus()); }
        p.setStatus(status);
        return projectRepository.saveAndFlush(p);
    }

    @Transactional
    public void delete(Long id) {
        Project p = find(id);
        requireOwner(p);
        if (p.getStatus() == ProjectStatus.ACTIVE) {
            throw new BadRequestException("Cannot delete an ACTIVE project. Cancel it first.");
        }
        projectRepository.delete(p);
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    public Project find(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Project not found: " + id));
    }

    private Long me() { return currentUserResolver.getCurrentUserId(); }

    private void requireAccess(Project p) {
        Long me = me();
        if (!p.getClientId().equals(me) && !isFreelancer(p, me)) {
            throw new ForbiddenException("You don't have access to this project");
        }
    }

    private void requireOwnerOrFreelancer(Project p) {
        Long me = me();
        if (!p.getClientId().equals(me) && !isFreelancer(p, me)) {
            throw new ForbiddenException("Only project client or assigned freelancer can do this");
        }
    }

    private void requireOwner(Project p) {
        if (!p.getClientId().equals(me())) throw new ForbiddenException("Only the project creator can do this");
    }

    private boolean isFreelancer(Project p, Long userId) {
        return p.getFreelancerId() != null && p.getFreelancerId().equals(userId);
    }
}
