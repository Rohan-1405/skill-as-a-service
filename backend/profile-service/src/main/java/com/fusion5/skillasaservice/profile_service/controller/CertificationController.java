package com.fusion5.skillasaservice.profile_service.controller;

import com.fusion5.skillasaservice.profile_service.dto.request.CertificationRequest;
import com.fusion5.skillasaservice.profile_service.entity.Certification;
import com.fusion5.skillasaservice.profile_service.service.CertificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profile/freelancer/{id}/certifications")
@RequiredArgsConstructor
public class CertificationController {

    private final CertificationService certificationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Certification add(@PathVariable Long id, @Valid @RequestBody CertificationRequest request) {
        return certificationService.add(id, request);
    }

    @GetMapping
    public List<Certification> list(@PathVariable Long id) {
        return certificationService.list(id);
    }

    @PutMapping("/{certId}")
    public Certification update(@PathVariable Long id, @PathVariable Long certId,
                                 @Valid @RequestBody CertificationRequest request) {
        return certificationService.update(id, certId, request);
    }

    @DeleteMapping("/{certId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id, @PathVariable Long certId) {
        certificationService.delete(id, certId);
    }
}
