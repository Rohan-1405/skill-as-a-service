package com.fusion5.skillasaservice.auth_service.service;

import com.fusion5.skillasaservice.auth_service.dto.EmailEvent;
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

    @Value("${app.email.verification-url}")
    private String verificationUrl;

    @Value("${app.email.verification-token-expiry}")
    private long verificationTokenExpiry;

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

    public ApiResponse<String> logout(String userId) {
        redisTemplate.delete("access_token:"  + userId);
        redisTemplate.delete("refresh_token:" + userId);
        log.info("User logged out: {}", userId);
        return ApiResponse.success("Logged out successfully", null);
    }
}