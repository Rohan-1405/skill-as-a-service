package com.fusion5.skillasaservice.profile_service.service;

import com.fusion5.skillasaservice.profile_service.dto.request.WorkExperienceRequest;
import com.fusion5.skillasaservice.profile_service.entity.WorkExperience;
import com.fusion5.skillasaservice.profile_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.profile_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.profile_service.repository.WorkExperienceRepository;
import com.fusion5.skillasaservice.profile_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class WorkExperienceService {

    private final WorkExperienceRepository expRepo;
    private final CurrentUserResolver      currentUserResolver;

    @Transactional
    public WorkExperience add(Long profileUserId, WorkExperienceRequest req) {
        requireOwnership(profileUserId);
        WorkExperience e = new WorkExperience();
        e.setUserId(profileUserId);
        return applyAndSave(req, e);
    }

    public List<WorkExperience> list(Long userId) {
        return expRepo.findByUserIdOrderByStartDateDesc(userId);
    }

    @Transactional
    public WorkExperience update(Long profileUserId, Long expId, WorkExperienceRequest req) {
        requireOwnership(profileUserId);
        WorkExperience e = expRepo.findById(expId)
                .filter(exp -> exp.getUserId().equals(profileUserId))
                .orElseThrow(() -> new ResourceNotFoundException("Work experience not found"));
        return applyAndSave(req, e);
    }

    @Transactional
    public void delete(Long profileUserId, Long expId) {
        requireOwnership(profileUserId);
        WorkExperience e = expRepo.findById(expId)
                .filter(exp -> exp.getUserId().equals(profileUserId))
                .orElseThrow(() -> new ResourceNotFoundException("Work experience not found"));
        expRepo.delete(e);
    }

    private void requireOwnership(Long profileUserId) {
        Long callerId = currentUserResolver.getCurrentUserId();
        if (!callerId.equals(profileUserId)) throw new ForbiddenException("You can only manage your own work experience");
    }

    private WorkExperience applyAndSave(WorkExperienceRequest req, WorkExperience e) {
        e.setJobTitle(req.getJobTitle());
        e.setCompany(req.getCompany());
        if (req.getLocation() != null) e.setLocation(req.getLocation());
        e.setStartDate(req.getStartDate());
        e.setCurrentlyWorking(req.isCurrentlyWorking());
        if (!req.isCurrentlyWorking() && req.getEndDate() != null) e.setEndDate(req.getEndDate());
        else e.setEndDate(null);
        if (req.getDescription() != null) e.setDescription(req.getDescription());
        return expRepo.saveAndFlush(e);
    }
}
