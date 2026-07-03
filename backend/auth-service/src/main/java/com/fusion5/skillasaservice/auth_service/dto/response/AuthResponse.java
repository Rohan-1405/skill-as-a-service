package com.fusion5.skillasaservice.auth_service.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String userId;
    private String email;
    private List<String> roles;
    private String message;

    // ── 2FA gate fields ────────────────────────────────────────────────────────
    // Populated INSTEAD of tokens when 2FA is enabled on the account.
    // Client reads requiresTwoFactor == true, then POSTs twoFaTempToken + TOTP
    // code to /api/auth/2fa/validate to receive the real tokens.
    @Builder.Default
    private boolean requiresTwoFactor = false;
    private String twoFaTempToken;
}
