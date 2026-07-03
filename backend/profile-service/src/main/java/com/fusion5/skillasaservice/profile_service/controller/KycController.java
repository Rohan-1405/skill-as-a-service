package com.fusion5.skillasaservice.profile_service.controller;

import com.fusion5.skillasaservice.profile_service.dto.request.KycRejectRequest;
import com.fusion5.skillasaservice.profile_service.dto.request.KycSubmitRequest;
import com.fusion5.skillasaservice.profile_service.entity.KycDocument;
import com.fusion5.skillasaservice.profile_service.service.KycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class KycController {

    private final KycService kycService;

    // ── Freelancer endpoints ──────────────────────────────────────────────────

    @PostMapping("/api/profile/kyc/submit")
    @PreAuthorize("hasRole('FREELANCER')")
    @ResponseStatus(HttpStatus.CREATED)
    public KycDocument submit(@Valid @RequestBody KycSubmitRequest request) {
        return kycService.submit(request);
    }

    @GetMapping("/api/profile/kyc/status")
    @PreAuthorize("hasRole('FREELANCER')")
    public List<KycDocument> myStatus() {
        return kycService.myStatus();
    }

    // ── Admin endpoints ───────────────────────────────────────────────────────

    @GetMapping("/api/admin/kyc")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public Page<KycDocument> listAll(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return kycService.listAll(status,
                PageRequest.of(page, size, Sort.by("submittedAt").descending()));
    }

    @PutMapping("/api/admin/kyc/{id}/approve")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public KycDocument approve(@PathVariable Long id) {
        return kycService.approve(id);
    }

    @PutMapping("/api/admin/kyc/{id}/reject")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public KycDocument reject(@PathVariable Long id, @Valid @RequestBody KycRejectRequest request) {
        return kycService.reject(id, request);
    }
}
