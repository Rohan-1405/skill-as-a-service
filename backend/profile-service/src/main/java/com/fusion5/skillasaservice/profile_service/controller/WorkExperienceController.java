package com.fusion5.skillasaservice.profile_service.controller;

import com.fusion5.skillasaservice.profile_service.dto.request.WorkExperienceRequest;
import com.fusion5.skillasaservice.profile_service.entity.WorkExperience;
import com.fusion5.skillasaservice.profile_service.service.WorkExperienceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profile/freelancer/{id}/experience")
@RequiredArgsConstructor
public class WorkExperienceController {

    private final WorkExperienceService workExperienceService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public WorkExperience add(@PathVariable Long id, @Valid @RequestBody WorkExperienceRequest request) {
        return workExperienceService.add(id, request);
    }

    @GetMapping
    public List<WorkExperience> list(@PathVariable Long id) {
        return workExperienceService.list(id);
    }

    @PutMapping("/{expId}")
    public WorkExperience update(@PathVariable Long id, @PathVariable Long expId,
                                  @Valid @RequestBody WorkExperienceRequest request) {
        return workExperienceService.update(id, expId, request);
    }

    @DeleteMapping("/{expId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @PathVariable Long expId) {
        workExperienceService.delete(id, expId);
    }
}
