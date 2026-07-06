package com.fusion5.skillasaservice.cms_service.controller;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateFaqRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.UpdateFaqRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.cms_service.entity.Faq;
import com.fusion5.skillasaservice.cms_service.service.FaqService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class FaqController {

    private final FaqService faqService;

    @GetMapping("/api/cms/faqs")
    public ResponseEntity<ApiResponse<List<Faq>>> listActive() {
        return ResponseEntity.ok(ApiResponse.success("OK", faqService.listActive()));
    }

    @PostMapping("/api/admin/cms/faqs")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Faq>> create(@Valid @RequestBody CreateFaqRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("FAQ created", faqService.create(req)));
    }

    @PutMapping("/api/admin/cms/faqs/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Faq>> update(@PathVariable Long id, @Valid @RequestBody UpdateFaqRequest req) {
        return ResponseEntity.ok(ApiResponse.success("FAQ updated", faqService.update(id, req)));
    }

    @DeleteMapping("/api/admin/cms/faqs/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        faqService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("FAQ deleted", null));
    }
}
