package com.fusion5.skillasaservice.auth_service.controller;

import com.fusion5.skillasaservice.auth_service.dto.request.TwoFaValidateRequest;
import com.fusion5.skillasaservice.auth_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.auth_service.dto.response.AuthResponse;
import com.fusion5.skillasaservice.auth_service.entity.Role;
import com.fusion5.skillasaservice.auth_service.entity.User;
import com.fusion5.skillasaservice.auth_service.repository.UserRepository;
import com.fusion5.skillasaservice.auth_service.service.TwoFactorService;
import com.fusion5.skillasaservice.auth_service.service.TwoFactorService.TwoFaSetupResponse;
import com.fusion5.skillasaservice.auth_service.util.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth/2fa")
@RequiredArgsConstructor
public class TwoFactorController {

    private final TwoFactorService twoFactorService;
    private final UserRepository   userRepository;
    private final JwtUtil          jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;

    /** GET /api/auth/2fa/status — is 2FA enabled? Requires Bearer token. */
    @GetMapping("/status")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> status(
            @AuthenticationPrincipal String userUuid) {
        return ResponseEntity.ok(ApiResponse.success("OK",
                Map.of("twoFaEnabled", twoFactorService.isEnabled(userUuid))));
    }

    /**
     * POST /api/auth/2fa/setup
     * Step 1: returns TOTP secret + QR code base64 PNG.
     * Requires Bearer token.
     */
    @PostMapping("/setup")
    public ResponseEntity<ApiResponse<TwoFaSetupResponse>> setup(
            @AuthenticationPrincipal String userUuid) {
        TwoFaSetupResponse resp = twoFactorService.initSetup(userUuid);
        return ResponseEntity.ok(ApiResponse.success(
                "Scan the QR code in your authenticator app, then call /confirm", resp));
    }

    /**
     * POST /api/auth/2fa/confirm
     * Step 2: first TOTP code to activate 2FA.
     * Body: { "code": "123456" }  — Requires Bearer token.
     */
    @PostMapping("/confirm")
    public ResponseEntity<ApiResponse<String>> confirm(
            @AuthenticationPrincipal String userUuid,
            @RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null || code.isBlank())
            return ResponseEntity.badRequest().body(ApiResponse.error("code is required"));
        twoFactorService.confirmSetup(userUuid, code);
        return ResponseEntity.ok(ApiResponse.success("2FA has been enabled successfully", null));
    }

    /**
     * DELETE /api/auth/2fa/disable
     * Body: { "code": "123456" }  — Requires Bearer token.
     */
    @DeleteMapping("/disable")
    public ResponseEntity<ApiResponse<String>> disable(
            @AuthenticationPrincipal String userUuid,
            @RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null || code.isBlank())
            return ResponseEntity.badRequest().body(ApiResponse.error("code is required"));
        twoFactorService.disable(userUuid, code);
        return ResponseEntity.ok(ApiResponse.success("2FA has been disabled", null));
    }

    /**
     * POST /api/auth/2fa/validate  — PUBLIC (no Bearer needed).
     * Called after login returns { requiresTwoFactor: true, twoFaTempToken: "..." }.
     * Body: { "twoFaTempToken": "...", "code": "123456" }
     * Returns full AuthResponse with accessToken + refreshToken on success.
     */
    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<AuthResponse>> validate(
            @Valid @RequestBody TwoFaValidateRequest request) {

        // Validate TOTP code + consume temp token → returns user UUID
        String userUuid = twoFactorService.validateAndGetUuid(
                request.getTwoFaTempToken(), request.getCode());

        User user = userRepository.findByUuid(userUuid)
                .orElseThrow(() -> new IllegalStateException("User not found after 2FA validation"));

        List<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList());

        // Generate and store tokens exactly as AuthService.login() does
        String accessToken  = jwtUtil.generateAccessToken(user.getUuid(), user.getEmail(), roles);
        String refreshToken = jwtUtil.generateRefreshToken(user.getUuid());

        redisTemplate.opsForValue().set("access_token:"  + user.getUuid(), accessToken,  15, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set("refresh_token:" + user.getUuid(), refreshToken,   7, TimeUnit.DAYS);

        return ResponseEntity.ok(ApiResponse.success("2FA verified. Login successful.",
                AuthResponse.builder()
                        .accessToken(accessToken)
                        .refreshToken(refreshToken)
                        .userId(user.getUuid())
                        .email(user.getEmail())
                        .roles(roles)
                        .message("Login successful")
                        .build()));
    }
}
