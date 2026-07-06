package com.fusion5.skillasaservice.cms_service.controller;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateLanguageRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.cms_service.entity.Language;
import com.fusion5.skillasaservice.cms_service.service.LanguageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LanguageController {

    private final LanguageService languageService;

    @GetMapping("/api/languages")
    public ResponseEntity<ApiResponse<List<Language>>> listActive() {
        return ResponseEntity.ok(ApiResponse.success("OK", languageService.listActive()));
    }

    @PostMapping("/api/admin/languages")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_CMS')")
    public ResponseEntity<ApiResponse<Language>> create(@Valid @RequestBody CreateLanguageRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Language added", languageService.create(req)));
    }
}
