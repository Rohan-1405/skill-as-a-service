package com.fusion5.skillasaservice.project_service.service;
import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.entity.*;
import com.fusion5.skillasaservice.project_service.exception.*;
import com.fusion5.skillasaservice.project_service.repository.MilestoneRepository;
import com.fusion5.skillasaservice.project_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class MilestoneService {
    private final MilestoneRepository milestoneRepository;
    private final ProjectService projectService;
    private final CurrentUserResolver currentUserResolver;

    @Transactional
    public Milestone create(Long projectId, CreateMilestoneRequest req) {
        projectService.getById(projectId); // validates access
        Milestone m = new Milestone();
        m.setProjectId(projectId); m.setTitle(req.getTitle());
        m.setDescription(req.getDescription()); m.setDueDate(req.getDueDate());
        return milestoneRepository.saveAndFlush(m);
    }

    public List<Milestone> list(Long projectId) {
        projectService.getById(projectId);
        return milestoneRepository.findByProjectIdOrderByDueDateAsc(projectId);
    }

    @Transactional
    public Milestone update(Long projectId, Long milestoneId, UpdateMilestoneRequest req) {
        projectService.getById(projectId);
        Milestone m = find(milestoneId, projectId);
        if (req.getTitle() != null)       m.setTitle(req.getTitle());
        if (req.getDescription() != null) m.setDescription(req.getDescription());
        if (req.getDueDate() != null)     m.setDueDate(req.getDueDate());
        if (req.getStatus() != null) {
            try { m.setStatus(Milestone.MilestoneStatus.valueOf(req.getStatus().toUpperCase())); }
            catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + req.getStatus()); }
        }
        return milestoneRepository.saveAndFlush(m);
    }

    /** Dedicated status-only update (PATCH /milestones/{id}/status). */
    @Transactional
    public Milestone updateStatus(Long projectId, Long milestoneId, String status) {
        projectService.getById(projectId);
        Milestone m = find(milestoneId, projectId);
        try {
            m.setStatus(Milestone.MilestoneStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new BadRequestException("Invalid status: " + status);
        }
        return milestoneRepository.saveAndFlush(m);
    }

    @Transactional
    public void delete(Long projectId, Long milestoneId) {
        projectService.getById(projectId);
        milestoneRepository.delete(find(milestoneId, projectId));
    }

    private Milestone find(Long id, Long projectId) {
        return milestoneRepository.findById(id)
                .filter(m -> m.getProjectId().equals(projectId))
                .orElseThrow(() -> new ResourceNotFoundException("Milestone not found: " + id));
    }
}
