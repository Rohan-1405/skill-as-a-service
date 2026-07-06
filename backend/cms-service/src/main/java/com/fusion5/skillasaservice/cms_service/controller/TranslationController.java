package com.fusion5.skillasaservice.cms_service.controller;

import com.fusion5.skillasaservice.cms_service.dto.request.UpdateTranslationsRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.cms_service.service.TranslationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class TranslationController {

    private final TranslationService translationService;

    /** GET /api/languages/{code}/translations — public, frontend needs this to render */
    @GetMapping("/api/languages/{code}/translations")
    public ResponseEntity<ApiResponse<Map<String, String>>> get(@PathVariable String code) {
        return ResponseEntity.ok(ApiResponse.success("OK", translationService.getForLanguage(code)));
    }

    /** PUT /api/admin/languages/{code}/translations — admin-only bulk upsert */
    @PutMapping("/api/admin/languages/{code}/translations")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_CMS')")
    public ResponseEntity<ApiResponse<Map<String, String>>> update(
            @PathVariable String code, @Valid @RequestBody UpdateTranslationsRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Translations updated", translationService.bulkUpsert(code, req)));
    }
}
