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
import org.springframework.data.redis.core.RedisTemplate;
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

        // Generate email verification token (JWT, 24hr expiry)
        String verificationToken = jwtUtil.generateEmailVerificationToken(
                user.getUuid(), user.getEmail(), verificationTokenExpiry);

        String verificationLink = verificationUrl + "?token=" + verificationToken;

        String emailBody = "Hi " + user.getFirstName() + ",\n\n"
                + "Welcome to SkillAsAService! Please verify your email address by clicking the link below:\n\n"
                + verificationLink + "\n\n"
                + "This link will expire in 24 hours.\n\n"
                + "If you did not create this account, please ignore this email.\n\n"
                + "Regards,\nSkillAsAService Team";

        EmailEvent emailEvent = EmailEvent.builder()
                .toEmail(user.getEmail())
                .subject("Verify Your Email - SkillAsAService")
                .body(emailBody)
                .type(EmailEvent.EmailType.VERIFICATION)
                .build();

        emailProducer.sendEmailEvent(emailEvent);

        return ApiResponse.success("Registration successful. Please check your email to verify your account.", user.getUuid());
    }

    @Transactional
    public ApiResponse<String> verifyEmail(String token) {
        if (!jwtUtil.isTokenValid(token)) {
            return ApiResponse.error("Invalid or malformed verification token");
        }

        if (jwtUtil.isTokenExpired(token)) {
            return ApiResponse.error("Verification link has expired. Please request a new one.");
        }

        String tokenType = jwtUtil.extractTokenType(token);
        if (!"EMAIL_VERIFICATION".equals(tokenType)) {
            return ApiResponse.error("Invalid token type");
        }

        String userUuid = jwtUtil.extractUserId(token);
        String email = jwtUtil.extractEmail(token);

        User user = userRepository.findByUuid(userUuid)
                .orElse(null);

        if (user == null || !user.getEmail().equals(email)) {
            return ApiResponse.error("User not found or token mismatch");
        }

        if (user.getEmailVerified()) {
            return ApiResponse.success("Email already verified. You can log in.", null);
        }

        user.setEmailVerified(true);
        user.setStatus(User.UserStatus.ACTIVE);
        userRepository.save(user);

        log.info("Email verified successfully for user: {}", user.getEmail());

        // Send welcome email
        String welcomeBody = "Hi " + user.getFirstName() + ",\n\n"
                + "Your email has been verified successfully! Your account is now active.\n\n"
                + "You can now log in and start using SkillAsAService.\n\n"
                + "Regards,\nSkillAsAService Team";

        EmailEvent welcomeEvent = EmailEvent.builder()
                .toEmail(user.getEmail())
                .subject("Welcome to SkillAsAService - Account Verified")
                .body(welcomeBody)
                .type(EmailEvent.EmailType.WELCOME)
                .build();

        emailProducer.sendEmailEvent(welcomeEvent);

        return ApiResponse.success("Email verified successfully. You can now log in.", null);
    }

    public ApiResponse<AuthResponse> login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null || !passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ApiResponse.error("Invalid email or password");
        }

        if (!user.getEmailVerified()) {
            return ApiResponse.error("Please verify your email before logging in");
        }

        if (user.getStatus() == User.UserStatus.BLOCKED ||
            user.getStatus() == User.UserStatus.SUSPENDED) {
            return ApiResponse.error("Account is " + user.getStatus().name().toLowerCase());
        }

        List<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList());

        String accessToken  = jwtUtil.generateAccessToken(user.getUuid(), user.getEmail(), roles);
        String refreshToken = jwtUtil.generateRefreshToken(user.getUuid());

        redisTemplate.opsForValue().set(
            "access_token:" + user.getUuid(), accessToken, 15, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set(
            "refresh_token:" + user.getUuid(), refreshToken, 7, TimeUnit.DAYS);

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getUuid())
                .email(user.getEmail())
                .roles(roles)
                .message("Login successful")
                .build();

        return ApiResponse.success("Login successful", authResponse);
    }

    @Transactional
    public ApiResponse<AuthResponse> socialLogin(SocialLoginRequest request) {
        SocialAccount.Provider provider;
        try {
            provider = SocialAccount.Provider.valueOf(request.getProvider().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ApiResponse.error("Unsupported provider: " + request.getProvider());
        }

        if (provider != SocialAccount.Provider.GOOGLE) {
            return ApiResponse.error(provider + " login is not yet supported");
        }

        GoogleUserInfoResponse googleUser;
        try {
            googleUser = restTemplate.getForObject(
                    googleUserInfoUrl + "?access_token=" + request.getAccessToken(),
                    GoogleUserInfoResponse.class);
        } catch (Exception e) {
            log.warn("Google token validation failed: {}", e.getMessage());
            return ApiResponse.error("Invalid or expired Google access token");
        }

        if (googleUser == null || googleUser.getSub() == null || googleUser.getEmail() == null) {
            return ApiResponse.error("Unable to retrieve user info from Google");
        }

        String providerUserId = googleUser.getSub();
        String email = googleUser.getEmail();

        User user = socialAccountRepository
                .findByProviderAndProviderUserId(provider, providerUserId)
                .map(SocialAccount::getUser)
                .orElse(null);

        if (user == null) {
            user = userRepository.findByEmail(email).orElse(null);

            if (user == null) {
                String roleName = (request.getRole() != null && !request.getRole().isBlank())
                        ? request.getRole().toUpperCase()
                        : "CLIENT";

                Role role;
                try {
                    role = roleRepository.findByRoleName(roleName)
                            .orElseThrow(() -> new RuntimeException("Invalid role: " + roleName));
                } catch (RuntimeException e) {
                    return ApiResponse.error(e.getMessage());
                }

                String firstName = googleUser.getGiven_name();
                String lastName = googleUser.getFamily_name();
                if ((firstName == null || firstName.isBlank()) && googleUser.getName() != null) {
                    String[] parts = googleUser.getName().trim().split(" ", 2);
                    firstName = parts[0];
                    lastName = parts.length > 1 ? parts[1] : "";
                }

                user = User.builder()
                        .firstName(firstName != null ? firstName : "User")
                        .lastName(lastName != null ? lastName : "")
                        .email(email)
                        .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                        .status(User.UserStatus.ACTIVE)
                        .emailVerified(true)
                        .roles(new HashSet<>(Set.of(role)))
                        .build();

                user = userRepository.save(user);
                log.info("New user created via GOOGLE social login: {}", email);
            }

            SocialAccount socialAccount = SocialAccount.builder()
                    .user(user)
                    .provider(provider)
                    .providerUserId(providerUserId)
                    .build();
            socialAccountRepository.save(socialAccount);
            log.info("Linked GOOGLE account ({}) to user {}", providerUserId, user.getEmail());
        }

        if (user.getStatus() == User.UserStatus.BLOCKED || user.getStatus() == User.UserStatus.SUSPENDED) {
            return ApiResponse.error("Account is " + user.getStatus().name().toLowerCase());
        }

        List<String> roles = user.getRoles().stream()
                .map(Role::getRoleName)
                .collect(Collectors.toList());

        String accessToken = jwtUtil.generateAccessToken(user.getUuid(), user.getEmail(), roles);
        String refreshToken = jwtUtil.generateRefreshToken(user.getUuid());

        redisTemplate.opsForValue().set(
                "access_token:" + user.getUuid(), accessToken, 15, TimeUnit.MINUTES);
        redisTemplate.opsForValue().set(
                "refresh_token:" + user.getUuid(), refreshToken, 7, TimeUnit.DAYS);

        AuthResponse authResponse = AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getUuid())
                .email(user.getEmail())
                .roles(roles)
                .message("Social login successful")
                .build();

        return ApiResponse.success("Social login successful", authResponse);
    }

    @Transactional
    public ApiResponse<String> forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            return ApiResponse.error("No account found with this email address");
        }

        String token = UUID.randomUUID().toString();

        PasswordReset passwordReset = PasswordReset.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plus(Duration.ofMillis(resetTokenExpiry)))
                .used(false)
                .build();

        passwordResetRepository.save(passwordReset);

        String resetLink = resetPasswordUrl + "?token=" + token;

        String emailBody = "Hi " + user.getFirstName() + ",\n\n"
                + "We received a request to reset your password. Click the link below to set a new password:\n\n"
                + resetLink + "\n\n"
                + "This link will expire in 15 minutes.\n\n"
                + "If you did not request this, please ignore this email and your password will remain unchanged.\n\n"
                + "Regards,\nSkillAsAService Team";

        EmailEvent emailEvent = EmailEvent.builder()
                .toEmail(user.getEmail())
                .subject("Reset Your Password - SkillAsAService")
                .body(emailBody)
                .type(EmailEvent.EmailType.PASSWORD_RESET)
                .build();

        emailProducer.sendEmailEvent(emailEvent);

        log.info("Password reset requested for: {}", user.getEmail());

        return ApiResponse.success("Password reset link has been sent to your email.", null);
    }

    @Transactional
    public ApiResponse<String> resetPassword(ResetPasswordRequest request) {
        PasswordReset passwordReset = passwordResetRepository.findByToken(request.getToken())
                .orElse(null);

        if (passwordReset == null) {
            return ApiResponse.error("Invalid or expired reset token");
        }

        if (passwordReset.getUsed()) {
            return ApiResponse.error("This reset link has already been used");
        }

        if (passwordReset.getExpiresAt().isBefore(LocalDateTime.now())) {
            return ApiResponse.error("Reset link has expired. Please request a new one.");
        }

        User user = passwordReset.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        passwordReset.setUsed(true);
        passwordResetRepository.save(passwordReset);

        // Invalidate any active sessions, forcing re-login with the new password
        redisTemplate.delete("access_token:" + user.getUuid());
        redisTemplate.delete("refresh_token:" + user.getUuid());

        log.info("Password reset successfully for: {}", user.getEmail());

        return ApiResponse.success("Password reset successfully. You can now log in with your new password.", null);
    }

    public ApiResponse<String> logout(String userId) {
        redisTemplate.delete("access_token:"  + userId);
        redisTemplate.delete("refresh_token:" + userId);
        log.info("User logged out: {}", userId);
        return ApiResponse.success("Logged out successfully", null);
    }
}
