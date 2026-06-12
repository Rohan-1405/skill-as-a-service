package com.fusion5.skillasaservice.auth_service.controller;

import com.fusion5.skillasaservice.auth_service.dto.request.*;
import com.fusion5.skillasaservice.auth_service.dto.response.*;
import com.fusion5.skillasaservice.auth_service.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(
            @Valid @RequestBody RegisterRequest request) {
        ApiResponse<String> response = authService.register(request);
        HttpStatus status = response.isSuccess() ? HttpStatus.CREATED : HttpStatus.CONFLICT;
        return ResponseEntity.status(status).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {
        ApiResponse<AuthResponse> response = authService.login(request);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.UNAUTHORIZED;
        return ResponseEntity.status(status).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(
            @RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(authService.logout(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service is running");
    }
}