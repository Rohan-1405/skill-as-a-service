package com.fusion5.skillasaservice.user_service.controller;

import com.fusion5.skillasaservice.user_service.dto.request.AssignRolesRequest;
import com.fusion5.skillasaservice.user_service.dto.request.UpdatePermissionsRequest;
import com.fusion5.skillasaservice.user_service.dto.request.UpdateUserRequest;
import com.fusion5.skillasaservice.user_service.dto.response.PagedUserResponse;
import com.fusion5.skillasaservice.user_service.dto.response.UserResponse;
import com.fusion5.skillasaservice.user_service.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    // Regular admin-user CRUD: SUPER_ADMIN, or an ADMIN holding the USERS permission tag
    @GetMapping
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_USERS')")
    public ResponseEntity<PagedUserResponse> listUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status) {
        return ResponseEntity.ok(userService.listUsers(page, size, search, status));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_USERS')")
    public ResponseEntity<UserResponse> getUser(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_USERS')")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id,
                                                     @Valid @RequestBody UpdateUserRequest request) {
        return ResponseEntity.ok(userService.updateUser(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_USERS')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.softDeleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/roles")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_USERS')")
    public ResponseEntity<UserResponse> assignRoles(@PathVariable Long id,
                                                      @Valid @RequestBody AssignRolesRequest request) {
        return ResponseEntity.ok(userService.assignRoles(id, request));
    }

    // ── Permissions — deliberately SUPER_ADMIN-only, not permission-gated.
    //    A Finance-scoped admin must never be able to grant themselves (or anyone else)
    //    more access, so this stays outside the permission system it manages.
    //    (The list-all-tags endpoint is separate: GET /api/admin/permissions, its own controller.) ──

    @GetMapping("/{id}/permissions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, List<String>>> getUserPermissions(@PathVariable Long id) {
        return ResponseEntity.ok(Map.of("permissions", userService.getUserPermissions(id)));
    }

    @PutMapping("/{id}/permissions")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<Map<String, List<String>>> updateUserPermissions(
            @PathVariable Long id, @Valid @RequestBody UpdatePermissionsRequest request) {
        return ResponseEntity.ok(Map.of("permissions", userService.updateUserPermissions(id, request)));
    }
}
