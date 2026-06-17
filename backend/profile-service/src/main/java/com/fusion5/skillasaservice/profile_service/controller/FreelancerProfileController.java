package com.fusion5.skillasaservice.profile_service.controller;

import com.fusion5.skillasaservice.profile_service.dto.request.CreateFreelancerProfileRequest;
import com.fusion5.skillasaservice.profile_service.dto.request.UpdateFreelancerProfileRequest;
import com.fusion5.skillasaservice.profile_service.dto.request.UpdateSkillsRequest;
import com.fusion5.skillasaservice.profile_service.dto.response.FreelancerProfileResponse;
import com.fusion5.skillasaservice.profile_service.service.FreelancerProfileService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile/freelancer")
public class FreelancerProfileController {

    private final FreelancerProfileService freelancerProfileService;

    public FreelancerProfileController(FreelancerProfileService freelancerProfileService) {
        this.freelancerProfileService = freelancerProfileService;
    }

    // US-PROF-01 - any authenticated FREELANCER creates their own profile (userId comes from JWT)
    @PostMapping
    @PreAuthorize("hasRole('FREELANCER')")
    @ResponseStatus(HttpStatus.CREATED)
    public FreelancerProfileResponse createProfile(@Valid @RequestBody CreateFreelancerProfileRequest request) {
        return freelancerProfileService.createProfile(request);
    }

    // Convenience endpoint (not in the original story, needed to verify the above) -
    // {id} here is the user's numeric id, matching freelancer_id usage elsewhere in the schema
    @GetMapping("/{id}")
    public FreelancerProfileResponse getProfile(@PathVariable Long id) {
        return freelancerProfileService.getProfileByUserId(id);
    }

    // US-PROF-02 - owner-only partial update
    @PutMapping("/{id}")
    public FreelancerProfileResponse updateProfile(@PathVariable Long id,
                                                     @RequestBody UpdateFreelancerProfileRequest request) {
        return freelancerProfileService.updateProfile(id, request);
    }

    // US-PROF-02 - owner-only, replace-semantics skill assignment
    @PutMapping("/{id}/skills")
    public FreelancerProfileResponse updateSkills(@PathVariable Long id,
                                                    @Valid @RequestBody UpdateSkillsRequest request) {
        return freelancerProfileService.updateSkills(id, request);
    }
}
