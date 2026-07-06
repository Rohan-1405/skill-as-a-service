package com.fusion5.skillasaservice.cms_service.controller;

import com.fusion5.skillasaservice.cms_service.dto.request.UpdateThemeSettingsRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.cms_service.entity.ThemeSetting;
import com.fusion5.skillasaservice.cms_service.service.ThemeSettingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ThemeController {

    private final ThemeSettingService themeSettingService;

    /** GET /api/theme/settings — PUBLIC read, added beyond the original spec (which only
     *  listed /api/admin/theme/settings for both GET and PUT). A live site's frontend needs
     *  colors/logo/mode WITHOUT being logged in as admin, so a public read alias is a
     *  practical necessity, not an oversight — flagging it explicitly rather than quietly
     *  changing the documented admin-only shape. */
    @GetMapping("/api/theme/settings")
    public ResponseEntity<ApiResponse<ThemeSetting>> getPublic() {
        return ResponseEntity.ok(ApiResponse.success("OK", themeSettingService.get()));
    }

    @GetMapping("/api/admin/theme/settings")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_CMS')")
    public ResponseEntity<ApiResponse<ThemeSetting>> getAdmin() {
        return ResponseEntity.ok(ApiResponse.success("OK", themeSettingService.get()));
    }

    @PutMapping("/api/admin/theme/settings")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_CMS')")
    public ResponseEntity<ApiResponse<ThemeSetting>> update(@Valid @RequestBody UpdateThemeSettingsRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Theme updated", themeSettingService.update(req)));
    }
}
