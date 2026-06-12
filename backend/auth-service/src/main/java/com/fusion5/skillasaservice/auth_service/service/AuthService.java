package com.fusion5.skillasaservice.auth_service.service;

import com.fusion5.skillasaservice.auth_service.dto.request.*;
import com.fusion5.skillasaservice.auth_service.dto.response.*;
import com.fusion5.skillasaservice.auth_service.entity.*;
import com.fusion5.skillasaservice.auth_service.repository.*;
import com.fusion5.skillasaservice.auth_service.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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

        // TODO: Publish email verification event to RabbitMQ (Day 2)
        return ApiResponse.success("Registration successful. Please verify your email.", user.getUuid());
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