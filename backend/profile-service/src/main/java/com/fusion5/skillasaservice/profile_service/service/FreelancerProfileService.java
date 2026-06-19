package com.fusion5.skillasaservice.profile_service.service;

import com.fusion5.skillasaservice.profile_service.dto.request.CreateFreelancerProfileRequest;
import com.fusion5.skillasaservice.profile_service.dto.request.UpdateFreelancerProfileRequest;
import com.fusion5.skillasaservice.profile_service.dto.request.UpdateSkillsRequest;
import com.fusion5.skillasaservice.profile_service.dto.response.FreelancerProfileResponse;
import com.fusion5.skillasaservice.profile_service.dto.response.SkillResponse;
import com.fusion5.skillasaservice.profile_service.entity.FreelancerProfile;
import com.fusion5.skillasaservice.profile_service.entity.Skill;
import com.fusion5.skillasaservice.profile_service.entity.UserSkill;
import com.fusion5.skillasaservice.profile_service.exception.BadRequestException;
import com.fusion5.skillasaservice.profile_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.profile_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.profile_service.repository.FreelancerProfileRepository;
import com.fusion5.skillasaservice.profile_service.repository.SkillRepository;
import com.fusion5.skillasaservice.profile_service.repository.UserSkillRepository;
import com.fusion5.skillasaservice.profile_service.security.CurrentUserResolver;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class FreelancerProfileService {

    private final FreelancerProfileRepository profileRepository;
    private final UserSkillRepository userSkillRepository;
    private final SkillRepository skillRepository;
    private final CurrentUserResolver currentUserResolver;

    public FreelancerProfileService(FreelancerProfileRepository profileRepository,
                                     UserSkillRepository userSkillRepository,
                                     SkillRepository skillRepository,
                                     CurrentUserResolver currentUserResolver) {
        this.profileRepository = profileRepository;
        this.userSkillRepository = userSkillRepository;
        this.skillRepository = skillRepository;
        this.currentUserResolver = currentUserResolver;
    }

    @Transactional
    public FreelancerProfileResponse createProfile(CreateFreelancerProfileRequest request) {
        Long userId = currentUserResolver.getCurrentUserId();

        if (profileRepository.existsByUserId(userId)) {
            throw new BadRequestException("A freelancer profile already exists for this user");
        }

        FreelancerProfile profile = new FreelancerProfile();
        profile.setUserId(userId);
        profile.setHeadline(request.getHeadline());
        profile.setBio(request.getBio());
        profile.setHourlyRate(request.getHourlyRate());
        profile.setExperienceYears(request.getExperienceYears());
        profile.setCountry(request.getCountry());
        profile.setCity(request.getCity());
        profile.setWebsite(request.getWebsite());
        profile.setLinkedinUrl(request.getLinkedinUrl());
        profile.setGithubUrl(request.getGithubUrl());
        profile.setProfileImage(request.getProfileImage());

        FreelancerProfile saved = profileRepository.saveAndFlush(profile);
        return toResponse(saved);
    }

    public FreelancerProfileResponse getProfileByUserId(Long pathUserId) {
        FreelancerProfile profile = profileRepository.findByUserId(pathUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found for user " + pathUserId));
        return toResponse(profile);
    }

    @Transactional
    public FreelancerProfileResponse updateProfile(Long pathUserId, UpdateFreelancerProfileRequest request) {
        requireOwnership(pathUserId);

        FreelancerProfile profile = profileRepository.findByUserId(pathUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found for user " + pathUserId));

        if (request.getHeadline() != null) profile.setHeadline(request.getHeadline());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getHourlyRate() != null) profile.setHourlyRate(request.getHourlyRate());
        if (request.getExperienceYears() != null) profile.setExperienceYears(request.getExperienceYears());
        if (request.getCountry() != null) profile.setCountry(request.getCountry());
        if (request.getCity() != null) profile.setCity(request.getCity());
        if (request.getWebsite() != null) profile.setWebsite(request.getWebsite());
        if (request.getLinkedinUrl() != null) profile.setLinkedinUrl(request.getLinkedinUrl());
        if (request.getGithubUrl() != null) profile.setGithubUrl(request.getGithubUrl());
        if (request.getProfileImage() != null) profile.setProfileImage(request.getProfileImage());
        if (request.getAvailabilityStatus() != null) profile.setAvailabilityStatus(request.getAvailabilityStatus());

        FreelancerProfile saved = profileRepository.saveAndFlush(profile);
        return toResponse(saved);
    }

    @Transactional
    public FreelancerProfileResponse updateSkills(Long pathUserId, UpdateSkillsRequest request) {
        requireOwnership(pathUserId);

        // Profile must exist before skills can be attached
        profileRepository.findByUserId(pathUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Freelancer profile not found for user " + pathUserId));

        List<Long> requestedSkillIds = request.getSkillIds();

        // Validate every requested skill id actually exists and is active
        for (Long skillId : requestedSkillIds) {
            skillRepository.findById(skillId)
                    .filter(Skill::getIsActive)
                    .orElseThrow(() -> new BadRequestException("Skill id " + skillId + " does not exist or is inactive"));
        }

        // Replace semantics: wipe existing rows, insert the new set
        userSkillRepository.deleteByUserId(pathUserId);
        for (Long skillId : requestedSkillIds) {
            UserSkill userSkill = new UserSkill();
            userSkill.setUserId(pathUserId);
            userSkill.setSkillId(skillId);
            userSkillRepository.save(userSkill);
        }

        FreelancerProfile profile = profileRepository.findByUserId(pathUserId).orElseThrow();
        return toResponse(profile);
    }

    private void requireOwnership(Long pathUserId) {
        Long currentUserId = currentUserResolver.getCurrentUserId();
        if (!currentUserId.equals(pathUserId)) {
            throw new ForbiddenException("You can only modify your own profile");
        }
    }

    private FreelancerProfileResponse toResponse(FreelancerProfile profile) {
        List<SkillResponse> skills = userSkillRepository.findByUserId(profile.getUserId()).stream()
                .map(us -> skillRepository.findById(us.getSkillId()).orElse(null))
                .filter(java.util.Objects::nonNull)
                .map(skill -> SkillResponse.builder()
                        .id(skill.getId())
                        .skillName(skill.getSkillName())
                        .isActive(skill.getIsActive())
                        .build())
                .toList();

        return FreelancerProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .headline(profile.getHeadline())
                .bio(profile.getBio())
                .hourlyRate(profile.getHourlyRate())
                .experienceYears(profile.getExperienceYears())
                .country(profile.getCountry())
                .city(profile.getCity())
                .website(profile.getWebsite())
                .linkedinUrl(profile.getLinkedinUrl())
                .githubUrl(profile.getGithubUrl())
                .profileImage(profile.getProfileImage())
                .profileViews(profile.getProfileViews())
                .availabilityStatus(profile.getAvailabilityStatus())
                .skills(skills)
                .createdAt(profile.getCreatedAt())
                .updatedAt(profile.getUpdatedAt())
                .build();
    }
}