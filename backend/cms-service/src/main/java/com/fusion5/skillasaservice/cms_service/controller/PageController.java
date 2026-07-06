package com.fusion5.skillasaservice.cms_service.controller;

import com.fusion5.skillasaservice.cms_service.dto.request.CreatePageRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.UpdatePageRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.cms_service.entity.Page;
import com.fusion5.skillasaservice.cms_service.service.PageService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PageController {

    private final PageService pageService;

    // ── Public ──────────────────────────────────────────────────────────────

    @GetMapping("/api/cms/pages")
    public ResponseEntity<ApiResponse<List<Page>>> listPublished() {
        return ResponseEntity.ok(ApiResponse.success("OK", pageService.listPublished()));
    }

    @GetMapping("/api/cms/pages/{slug}")
    public ResponseEntity<ApiResponse<Page>> getBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success("OK", pageService.getBySlug(slug)));
    }

    // ── Admin ───────────────────────────────────────────────────────────────

    @GetMapping("/api/admin/cms/pages")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<List<Page>>> listAllForAdmin() {
        return ResponseEntity.ok(ApiResponse.success("OK", pageService.listAllForAdmin()));
    }

    @PostMapping("/api/admin/cms/pages")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page>> create(@Valid @RequestBody CreatePageRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Page created", pageService.create(req)));
    }

    @PutMapping("/api/admin/cms/pages/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Page>> update(@PathVariable Long id, @Valid @RequestBody UpdatePageRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Page updated", pageService.update(id, req)));
    }

    @DeleteMapping("/api/admin/cms/pages/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        pageService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Page deleted", null));
    }
}
