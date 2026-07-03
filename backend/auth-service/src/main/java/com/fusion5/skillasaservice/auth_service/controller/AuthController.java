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
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        ApiResponse<String> response = authService.register(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.CREATED : HttpStatus.CONFLICT).body(response);
    }

    @GetMapping("/verify-email")
    public ResponseEntity<ApiResponse<String>> verifyEmail(@RequestParam("token") String token) {
        ApiResponse<String> response = authService.verifyEmail(token);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        ApiResponse<AuthResponse> response = authService.login(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/social-login")
    public ResponseEntity<ApiResponse<AuthResponse>> socialLogin(@Valid @RequestBody SocialLoginRequest request) {
        ApiResponse<AuthResponse> response = authService.socialLogin(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(response);
    }

    // ── Gap #4: Refresh Access Token ──────────────────────────────────────────
    // Client sends the refresh JWT received at login.
    // Returns new access + refresh tokens (rotation).
    @PostMapping("/refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> refresh(@Valid @RequestBody RefreshTokenRequest request) {
        ApiResponse<AuthResponse> response = authService.refreshAccessToken(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.UNAUTHORIZED).body(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        ApiResponse<String> response = authService.forgotPassword(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        ApiResponse<String> response = authService.resetPassword(request);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(@RequestHeader("X-User-Id") String userId) {
        return ResponseEntity.ok(authService.logout(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Auth Service is running");
    }
}
