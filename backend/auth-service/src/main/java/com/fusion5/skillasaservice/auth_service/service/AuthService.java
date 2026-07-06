package com.fusion5.skillasaservice.auth_service.service;

import com.fusion5.skillasaservice.auth_service.dto.EmailEvent;
import com.fusion5.skillasaservice.auth_service.dto.oauth.GoogleUserInfoResponse;
import com.fusion5.skillasaservice.auth_service.dto.request.*;
import com.fusion5.skillasaservice.auth_service.dto.response.*;
import com.fusion5.skillasaservice.auth_service.entity.*;
import com.fusion5.skillasaservice.auth_service.repository.*;
import com.fusion5.skillasaservice.auth_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final RedisTemplate<String, String> redisTemplate;
    private final EmailProducer emailProducer;
    private final SocialAccountRepository socialAccountRepository;
    private final RestTemplate restTemplate;
    private final PasswordResetRepository passwordResetRepository;

    @Value("${app.email.verification-url}")
    private String verificationUrl;

    @Value("${app.email.verification-token-expiry}")
    private long verificationTokenExpiry;

    @Value("${app.oauth.google.userinfo-url}")
    private String googleUserInfoUrl;

    @Value("${app.email.reset-password-url}")
    private String resetPasswordUrl;

    @Value("${app.email.reset-token-expiry}")
    private long resetTokenExpiry;

    // ── Register ──────────────────────────────────────────────────────────────
    @Transactional
    public ApiResponse<String> register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.error("Email already registered");
        }

        Role role = roleRepository.findByRoleName(request.getRole().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Invalid role: " + request.getRole()));

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .mobile(request.getMobile())
                .password(passwordEncoder.encode(request.getPassword()))
                .status(User.UserStatus.INACTIVE)
                .emailVerified(false)
                .roles(new HashSet<>(Set.of(role)))
                .build();

        userRepository.save(user);
        log.info("New user registered: {}", user.getEmail());

        String verificationToken = jwtUtil.generateEmailVerificationToken(
                user.getUuid(), user.getEmail(), verificationTokenExpiry);
        String verificationLink = verificationUrl + "?token=" + verificationToken;

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .toEmail(user.getEmail())
                .subject("Verify Your Email - SkillAsAService")
                .body("Hi " + user.getFirstName() + ",\n\nWelcome to SkillAsAService! Please verify your email:\n\n"
                        + verificationLink + "\n\nThis link expires in 24 hours.\n\nRegards,\nSkillAsAService Team")
                .type(EmailEvent.EmailType.VERIFICATION)
                .build());

        return ApiResponse.success("Registration successful. Please check your email to verify your account.", user.getUuid());
    }

    // ── Verify Email ──────────────────────────────────────────────────────────
    @Transactional
    public ApiResponse<String> verifyEmail(String token) {
        if (!jwtUtil.isTokenValid(token)) return ApiResponse.error("Invalid or malformed verification token");
        if (jwtUtil.isTokenExpired(token)) return ApiResponse.error("Verification link has expired. Please request a new one.");
        if (!"EMAIL_VERIFICATION".equals(jwtUtil.extractTokenType(token))) return ApiResponse.error("Invalid token type");

        String userUuid = jwtUtil.extractUserId(token);
        String email    = jwtUtil.extractEmail(token);
        User user = userRepository.findByUuid(userUuid).orElse(null);

        if (user == null || !user.getEmail().equals(email)) return ApiResponse.error("User not found or token mismatch");
        if (user.getEmailVerified()) return ApiResponse.success("Email already verified. You can log in.", null);

        user.setEmailVerified(true);
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);
        log.info("Email verified for: {}", user.getEmail());

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .toEmail(user.getEmail())
                .subject("Welcome to SkillAsAService - Account Verified")
                .body("Hi " + user.getFirstName() + ",\n\nYour email has been verified. Your account is now active.\n\nRegards,\nSkillAsAService Team")
                .type(EmailEvent.EmailType.WELCOME)
                .build());

        return ApiResponse.success("Email verified successfully. You can now log in.", null);
    }

    // ── Login (with 2FA gate) ─────────────────────────────────────────────────
    public ApiResponse<AuthResponse> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ApiResponse.error("Invalid email or password");
        }
        if (!user.getEmailVerified()) {
            return ApiResponse.error("Please verify your email before logging in");
        }
        if (user.getStatus() == User.UserStatus.BLOCKED || user.getStatus() == User.UserStatus.SUSPENDED) {
            return ApiResponse.error("Account is " + user.getStatus().name().toLowerCase());
        }

        // ── 2FA gate: if enabled, return a temp token instead of the real JWT ──
        if (Boolean.TRUE.equals(user.getTwoFaEnabled())) {
            String tempToken = UUID.randomUUID().toString();
            redisTemplate.opsForValue().set("2fa_temp:" + tempToken, user.getUuid(), 5, TimeUnit.MINUTES);
            log.info("2FA required for user: {}, temp token issued", user.getEmail());
            return ApiResponse.success("2FA verification required", AuthResponse.builder()
                    .requiresTwoFactor(true)
                    .twoFaTempToken(tempToken)
                    .build());
        }

        return ApiResponse.success("Login successful", buildAuthResponse(user, "Login successful"));
    }

    // ── Refresh Access Token ──────────────────────────────────────────────────
    public ApiResponse<AuthResponse> refreshAccessToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!jwtUtil.isTokenValid(refreshToken)) {
            return ApiResponse.error("Invalid refresh token");
        }
        if (jwtUtil.isTokenExpired(refreshToken)) {
            return ApiResponse.error("Refresh token has expired. Please log in again.");
        }
        if (!"REFRESH".equals(jwtUtil.extractTokenType(refreshToken))) {
            return ApiResponse.error("Invalid token type");
        }

        String userUuid = jwtUtil.extractUserId(refreshToken);

        // Verify the token is the one we issued (stored in Redis)
        String storedToken = redisTemplate.opsForValue().get("refresh_token:" + userUuid);
        if (!refreshToken.equals(storedToken)) {
            return ApiResponse.error("Refresh token is invalid or has been revoked");
        }

        User user = userRepository.findByUuid(userUuid).orElse(null);
        if (user == null || user.getStatus() == User.UserStatus.BLOCKED) {
            return ApiResponse.error("Account not found or blocked");
        }

        // Rotate: generate new pair and overwrite Redis
        List<String> roles = user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toList());
        List<String> permissions = extractPermissions(user, roles);
        String newAccessToken  = jwtUtil.generateAccessToken(user.getUuid(), user.getEmail(), roles, permissions);
        String newRefreshToken = jwtUtil.generateRefreshToken(user.getUuid());

        redisTemplate.opsForValue().set("access_token:"  + user.getUuid(), newAccessToken,  15, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set("refresh_token:" + user.getUuid(), newRefreshToken,  7, TimeUnit.DAYS);

        log.info("Tokens rotated for user: {}", user.getEmail());

        return ApiResponse.success("Token refreshed", AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .userId(user.getUuid())
                .email(user.getEmail())
                .roles(roles)
                .permissions(permissions)
                .message("Token refreshed")
                .build());
    }

    // ── Social Login (Google + Facebook + GitHub) ─────────────────────────────
    @Transactional
    public ApiResponse<AuthResponse> socialLogin(SocialLoginRequest request) {
        SocialAccount.Provider provider;
        try {
            provider = SocialAccount.Provider.valueOf(request.getProvider().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("Unsupported provider: " + request.getProvider() + ". Valid: GOOGLE, FACEBOOK, GITHUB");
        }

        // Fetch user info from the provider
        OAuthUserInfo info;
        try {
            info = switch (provider) {
                case GOOGLE   -> fetchGoogleUser(request.getAccessToken());
                case FACEBOOK -> fetchFacebookUser(request.getAccessToken());
                case GITHUB   -> fetchGithubUser(request.getAccessToken());
            };
        } catch (Exception e) {
            log.warn("{} token validation failed: {}", provider, e.getMessage());
            return ApiResponse.error("Invalid or expired " + provider + " access token");
        }

        if (info == null || info.providerUserId() == null || info.email() == null) {
            return ApiResponse.error("Could not retrieve user info from " + provider);
        }

        // Find existing link OR create user + link account
        User user = socialAccountRepository
                .findByProviderAndProviderUserId(provider, info.providerUserId())
                .map(SocialAccount::getUser)
                .orElse(null);

        if (user == null) {
            user = userRepository.findByEmail(info.email()).orElse(null);

            if (user == null) {
                String roleName = (request.getRole() != null && !request.getRole().isBlank())
                        ? request.getRole().toUpperCase() : "CLIENT";
                Role role;
                try {
                    role = roleRepository.findByRoleName(roleName)
                            .orElseThrow(() -> new RuntimeException("Invalid role: " + roleName));
                } catch (RuntimeException e) {
                    return ApiResponse.error(e.getMessage());
                }

                user = User.builder()
                        .firstName(info.firstName())
                        .lastName(info.lastName())
                        .email(info.email())
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .status(User.UserStatus.ACTIVE)
                        .emailVerified(true)
                        .roles(new HashSet<>(Set.of(role)))
                        .build();
                user = userRepository.save(user);
                log.info("New user created via {} social login: {}", provider, info.email());
            }

            socialAccountRepository.save(SocialAccount.builder()
                    .user(user)
                    .provider(provider)
                    .providerUserId(info.providerUserId())
                    .build());
            log.info("Linked {} account ({}) to user {}", provider, info.providerUserId(), user.getEmail());
        }

        if (user.getStatus() == User.UserStatus.BLOCKED || user.getStatus() == User.UserStatus.SUSPENDED) {
            return ApiResponse.error("Account is " + user.getStatus().name().toLowerCase());
        }

        return ApiResponse.success("Social login successful", buildAuthResponse(user, "Social login successful"));
    }

    // ── Forgot Password ───────────────────────────────────────────────────────
    @Transactional
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) return ApiResponse.error("No account found with this email address");

        String token = UUID.randomUUID().toString();
        passwordResetRepository.save(PasswordReset.builder()
                .user(user).token(token)
                .expiresAt(LocalDateTime.now().plus(Duration.ofMillis(resetTokenExpiry)))
                .used(false).build());

        emailProducer.sendEmailEvent(EmailEvent.builder()
                .toEmail(user.getEmail())
                .subject("Reset Your Password - SkillAsAService")
                .body("Hi " + user.getFirstName() + ",\n\nClick to reset your password:\n\n"
                        + resetPasswordUrl + "?token=" + token
                        + "\n\nThis link expires in 15 minutes.\n\nRegards,\nSkillAsAService Team")
                .type(EmailEvent.EmailType.PASSWORD_RESET)
                .build());

        log.info("Password reset requested for: {}", user.getEmail());
        return ApiResponse.success("Password reset link has been sent to your email.", null);
    }

    // ── Reset Password ────────────────────────────────────────────────────────
    @Transactional
    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {
        PasswordReset passwordReset = passwordResetRepository.findByToken(request.getToken()).orElse(null);
        if (passwordReset == null)                                   return ApiResponse.error("Invalid or expired reset token");
        if (passwordReset.getUsed())                                 return ApiResponse.error("This reset link has already been used");
        if (passwordReset.getExpiresAt().isBefore(LocalDateTime.now())) return ApiResponse.error("Reset link has expired. Please request a new one.");

        User user = passwordReset.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        passwordReset.setUsed(true);
        passwordResetRepository.save(passwordReset);

        redisTemplate.delete("access_token:"  + user.getUuid());
        redisTemplate.delete("refresh_token:" + user.getUuid());
        log.info("Password reset successfully for: {}", user.getEmail());

        return ApiResponse.success("Password reset successfully. You can now log in with your new password.", null);
    }

    // ── Logout ────────────────────────────────────────────────────────────────
    public ApiResponse<String> logout(String userId) {
        redisTemplate.delete("access_token:"  + userId);
        redisTemplate.delete("refresh_token:" + userId);
        log.info("User logged out: {}", userId);
        return ApiResponse.success("Logged out successfully", null);
    }

    // ── Private helpers ───────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user, String message) {
        List<String> roles = user.getRoles().stream().map(Role::getRoleName).collect(Collectors.toList());
        List<String> permissions = extractPermissions(user, roles);
        String accessToken  = jwtUtil.generateAccessToken(user.getUuid(), user.getEmail(), roles, permissions);
        String refreshToken = jwtUtil.generateRefreshToken(user.getUuid());
        redisTemplate.opsForValue().set("access_token:"  + user.getUuid(), accessToken,  15, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set("refresh_token:" + user.getUuid(), refreshToken,  7, TimeUnit.DAYS);
        return AuthResponse.builder()
                .accessToken(accessToken).refreshToken(refreshToken)
                .userId(user.getUuid()).email(user.getEmail())
                .roles(roles).permissions(permissions).message(message)
                .build();
    }

    /** Permissions only matter for the ADMIN role — SUPER_ADMIN bypasses permission
     *  checks entirely (via role, not this list), and FREELANCER/CLIENT never have any. */
    private List<String> extractPermissions(User user, List<String> roles) {
        if (!roles.contains("ADMIN")) return List.of();
        return user.getPermissions().stream().map(Permission::getPermissionName).collect(Collectors.toList());
    }

    private OAuthUserInfo fetchGoogleUser(String accessToken) {
        GoogleUserInfoResponse g = restTemplate.getForObject(
                googleUserInfoUrl + "?access_token=" + accessToken, GoogleUserInfoResponse.class);
        if (g == null) return null;
        String first = g.getGiven_name();
        String last  = g.getFamily_name();
        if ((first == null || first.isBlank()) && g.getName() != null) {
            String[] p = g.getName().trim().split(" ", 2);
            first = p[0]; last = p.length > 1 ? p[1] : "";
        }
        return new OAuthUserInfo(g.getSub(), g.getEmail(),
                first != null ? first : "User", last != null ? last : "");
    }

    private OAuthUserInfo fetchFacebookUser(String accessToken) {
        String url = "https://graph.facebook.com/v18.0/me?fields=id,name,email,first_name,last_name&access_token=" + accessToken;
        @SuppressWarnings("unchecked")
        Map<String, Object> resp = restTemplate.getForObject(url, Map.class);
        if (resp == null) return null;
        String first = (String) resp.getOrDefault("first_name", "");
        String last  = (String) resp.getOrDefault("last_name", "");
        if (first.isBlank() && resp.get("name") != null) {
            String[] p = ((String) resp.get("name")).trim().split(" ", 2);
            first = p[0]; last = p.length > 1 ? p[1] : "";
        }
        String email = (String) resp.get("email");
        if (email == null) throw new RuntimeException("Facebook account has no accessible email address");
        return new OAuthUserInfo((String) resp.get("id"), email, first, last);
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private OAuthUserInfo fetchGithubUser(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "token " + accessToken);
        headers.set("Accept", "application/vnd.github.v3+json");
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        Map<String, Object> resp = restTemplate.exchange(
                "https://api.github.com/user", HttpMethod.GET, entity, Map.class).getBody();
        if (resp == null) return null;

        String ghId  = String.valueOf(resp.get("id"));
        String email = (String) resp.get("email");

        // GitHub hides email in /user for many users — fetch from /user/emails
        if (email == null || email.isBlank()) {
            try {
                List<Map> emails = restTemplate.exchange(
                        "https://api.github.com/user/emails", HttpMethod.GET, entity,
                        new ParameterizedTypeReference<List<Map>>() {}).getBody();
                if (emails != null) {
                    email = emails.stream()
                            .filter(e -> Boolean.TRUE.equals(e.get("primary"))
                                      && Boolean.TRUE.equals(e.get("verified")))
                            .map(e -> (String) e.get("email"))
                            .findFirst().orElse(null);
                }
            } catch (Exception ignored) {}
        }
        if (email == null) throw new RuntimeException("GitHub account has no verified public email. Set one in GitHub Settings → Emails.");

        String name  = (String) resp.getOrDefault("name", "GitHub User");
        String[] p   = name.trim().split(" ", 2);
        return new OAuthUserInfo(ghId, email, p[0], p.length > 1 ? p[1] : "");
    }

    /** Immutable value object — provider-agnostic user info. */
    private record OAuthUserInfo(String providerUserId, String email,
                                  String firstName, String lastName) {}
}
