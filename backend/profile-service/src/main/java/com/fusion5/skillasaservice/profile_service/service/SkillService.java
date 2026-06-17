package com.fusion5.skillasaservice.profile_service.service;

import com.fusion5.skillasaservice.profile_service.dto.request.CreateSkillRequest;
import com.fusion5.skillasaservice.profile_service.dto.request.UpdateSkillRequest;
import com.fusion5.skillasaservice.profile_service.dto.response.SkillResponse;
import com.fusion5.skillasaservice.profile_service.entity.Skill;
import com.fusion5.skillasaservice.profile_service.exception.BadRequestException;
import com.fusion5.skillasaservice.profile_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.profile_service.repository.SkillRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SkillService {

    private final SkillRepository skillRepository;

    public SkillService(SkillRepository skillRepository) {
        this.skillRepository = skillRepository;
    }

    public List<SkillResponse> listActiveSkills() {
        return skillRepository.findByIsActiveTrue().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public SkillResponse createSkill(CreateSkillRequest request) {
        if (skillRepository.existsBySkillNameIgnoreCase(request.getSkillName())) {
            throw new BadRequestException("Skill '" + request.getSkillName() + "' already exists");
        }

        Skill skill = new Skill();
        skill.setSkillName(request.getSkillName());
        skill.setIsActive(true);

        return toResponse(skillRepository.save(skill));
    }

    @Transactional
    public SkillResponse updateSkill(Long skillId, UpdateSkillRequest request) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill " + skillId + " not found"));

        skill.setSkillName(request.getSkillName());
        return toResponse(skillRepository.save(skill));
    }

    @Transactional
    public void softDeleteSkill(Long skillId) {
        Skill skill = skillRepository.findById(skillId)
                .orElseThrow(() -> new ResourceNotFoundException("Skill " + skillId + " not found"));

        skill.setIsActive(false);
        skillRepository.save(skill);
        // Existing user_skills rows referencing this id are left untouched on purpose
    }

    private SkillResponse toResponse(Skill skill) {
        return SkillResponse.builder()
                .id(skill.getId())
                .skillName(skill.getSkillName())
                .isActive(skill.getIsActive())
                .build();
    }
}
