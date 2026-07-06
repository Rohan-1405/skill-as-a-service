package com.fusion5.skillasaservice.profile_service.controller;

import com.fusion5.skillasaservice.profile_service.dto.request.CreateSkillRequest;
import com.fusion5.skillasaservice.profile_service.dto.request.UpdateSkillRequest;
import com.fusion5.skillasaservice.profile_service.dto.response.SkillResponse;
import com.fusion5.skillasaservice.profile_service.service.SkillService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SkillController {

    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    // US-PROF-07 - public, no auth required (permitAll in SecurityConfig)
    @GetMapping("/api/skills")
    public List<SkillResponse> listSkills() {
        return skillService.listActiveSkills();
    }

    // US-PROF-07 - ADMIN and SUPER_ADMIN only
    @PostMapping("/api/admin/skills")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_SETTINGS')")
    @ResponseStatus(HttpStatus.CREATED)
    public SkillResponse createSkill(@Valid @RequestBody CreateSkillRequest request) {
        return skillService.createSkill(request);
    }

    @PutMapping("/api/admin/skills/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_SETTINGS')")
    public SkillResponse updateSkill(@PathVariable Long id, @Valid @RequestBody UpdateSkillRequest request) {
        return skillService.updateSkill(id, request);
    }

    @DeleteMapping("/api/admin/skills/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_SETTINGS')")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable Long id) {
        skillService.softDeleteSkill(id);
    }
}
