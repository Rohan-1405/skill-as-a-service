package com.fusion5.skillasaservice.cms_service.controller;

import com.fusion5.skillasaservice.cms_service.dto.request.CreateMenuRequest;
import com.fusion5.skillasaservice.cms_service.dto.request.UpdateMenuItemsRequest;
import com.fusion5.skillasaservice.cms_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.cms_service.dto.response.MenuResponseDto;
import com.fusion5.skillasaservice.cms_service.entity.Menu;
import com.fusion5.skillasaservice.cms_service.service.MenuService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class MenuController {

    private final MenuService menuService;

    // ── Public ──────────────────────────────────────────────────────────────

    /** GET /api/cms/menus — list of menus (id + name only, no items) */
    @GetMapping("/api/cms/menus")
    public ResponseEntity<ApiResponse<List<Menu>>> listAll() {
        return ResponseEntity.ok(ApiResponse.success("OK", menuService.listAll()));
    }

    /** GET /api/cms/menus/{id} — full tree with nested items, for actually rendering a menu */
    @GetMapping("/api/cms/menus/{id}")
    public ResponseEntity<ApiResponse<MenuResponseDto>> getWithItems(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", menuService.getWithItems(id)));
    }

    // ── Admin ───────────────────────────────────────────────────────────────

    @PostMapping("/api/admin/cms/menus")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Menu>> create(@Valid @RequestBody CreateMenuRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Menu created", menuService.create(req)));
    }

    /** PUT /api/admin/cms/menus/{id} — replaces the ENTIRE item list for this menu */
    @PutMapping("/api/admin/cms/menus/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<MenuResponseDto>> replaceItems(@PathVariable Long id, @Valid @RequestBody UpdateMenuItemsRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Menu items updated", menuService.replaceItems(id, req)));
    }

    @DeleteMapping("/api/admin/cms/menus/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        menuService.delete(id);
        return ResponseEntity.ok(ApiResponse.success("Menu deleted", null));
    }
}
