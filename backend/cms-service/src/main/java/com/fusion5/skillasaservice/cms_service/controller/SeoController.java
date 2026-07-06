package com.fusion5.skillasaservice.cms_service.controller;

import com.fusion5.skillasaservice.cms_service.dto.request.UpdateSeoSettingsRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.cms_service.entity.SeoSetting;
import com.fusion5.skillasaservice.cms_service.service.SeoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class SeoController {

    private final SeoService seoService;

    /** GET /api/seo/sitemap.xml — real XML content-type, not wrapped in ApiResponse JSON,
     *  since search engines and sitemap validators expect a raw sitemap document. */
    @GetMapping(value = "/api/seo/sitemap.xml", produces = MediaType.APPLICATION_XML_VALUE)
    public ResponseEntity<String> sitemap() {
        return ResponseEntity.ok().contentType(MediaType.APPLICATION_XML).body(seoService.generateSitemapXml());
    }

    /** GET /api/seo/robots.txt — plain text, same reasoning as sitemap.xml above. */
    @GetMapping(value = "/api/seo/robots.txt", produces = MediaType.TEXT_PLAIN_VALUE)
    public ResponseEntity<String> robots() {
        return ResponseEntity.ok().contentType(MediaType.TEXT_PLAIN).body(seoService.generateRobotsTxt());
    }

    @GetMapping("/api/admin/seo/settings")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_CMS')")
    public ResponseEntity<ApiResponse<SeoSetting>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success("OK", seoService.getSettings()));
    }

    @PutMapping("/api/admin/seo/settings")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_CMS')")
    public ResponseEntity<ApiResponse<SeoSetting>> updateSettings(@Valid @RequestBody UpdateSeoSettingsRequest req) {
        return ResponseEntity.ok(ApiResponse.success("SEO settings updated", seoService.updateSettings(req)));
    }
}
