package com.fusion5.skillasaservice.auth_service.service;

import com.fusion5.skillasaservice.auth_service.entity.User;
import com.fusion5.skillasaservice.auth_service.repository.UserRepository;
import dev.samstevens.totp.code.DefaultCodeGenerator;
import dev.samstevens.totp.code.DefaultCodeVerifier;
import dev.samstevens.totp.code.HashingAlgorithm;
import dev.samstevens.totp.qr.QrData;
import dev.samstevens.totp.qr.ZxingPngQrGenerator;
import dev.samstevens.totp.secret.DefaultSecretGenerator;
import dev.samstevens.totp.time.SystemTimeProvider;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Base64;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class TwoFactorService {

    private static final String SETUP_PREFIX = "2fa_setup:";
    private static final String TEMP_PREFIX  = "2fa_temp:";

    @Value("${app.2fa.setup-ttl-minutes:10}")
    private long setupTtlMinutes;

    private final UserRepository userRepository;
    private final RedisTemplate<String, String> redisTemplate;
    private final AuthService authService;

    private final DefaultSecretGenerator secretGenerator = new DefaultSecretGenerator(32);
    private final DefaultCodeVerifier    codeVerifier;
    private final ZxingPngQrGenerator    qrGenerator = new ZxingPngQrGenerator();

    public TwoFactorService(UserRepository userRepository,
                             RedisTemplate<String, String> redisTemplate,
                             AuthService authService) {
        this.userRepository = userRepository;
        this.redisTemplate  = redisTemplate;
        this.authService    = authService;

        DefaultCodeVerifier v = new DefaultCodeVerifier(
                new DefaultCodeGenerator(HashingAlgorithm.SHA1),
                new SystemTimeProvider());
        v.setTimePeriod(30);
        v.setAllowedTimePeriodDiscrepancy(1);
        this.codeVerifier = v;
    }

    // ── Step 1: Generate secret + QR code ────────────────────────────────────
    public TwoFaSetupResponse initSetup(String userUuid) {
        User user = findUser(userUuid);
        if (Boolean.TRUE.equals(user.getTwoFaEnabled())) {
            throw new IllegalStateException("2FA is already enabled. Disable it first to re-setup.");
        }

        String secret = secretGenerator.generate();
        redisTemplate.opsForValue().set(SETUP_PREFIX + user.getId(), secret, setupTtlMinutes, TimeUnit.MINUTES);

        QrData qrData = new QrData.Builder()
                .label(user.getEmail())
                .secret(secret)
                .issuer("SkillAsAService")
                .algorithm(HashingAlgorithm.SHA1)
                .digits(6).period(30)
                .build();

        String qrBase64 = generateQrBase64(qrData);

        log.info("2FA setup initiated for user: {}", user.getEmail());
        return new TwoFaSetupResponse(secret, qrData.getUri(), qrBase64);
    }

    // ── Step 2: Confirm setup with first TOTP code ────────────────────────────
    public void confirmSetup(String userUuid, String totpCode) {
        User user = findUser(userUuid);
        String secret = redisTemplate.opsForValue().get(SETUP_PREFIX + user.getId());

        if (secret == null) throw new IllegalStateException("2FA setup session expired. Please start setup again.");
        if (!codeVerifier.isValidCode(secret, totpCode)) throw new IllegalArgumentException("Invalid TOTP code. Check your authenticator app.");

        user.setTwoFaSecret(secret);
        user.setTwoFaEnabled(true);
        userRepository.save(user);
        redisTemplate.delete(SETUP_PREFIX + user.getId());

        log.info("2FA enabled for user: {}", user.getEmail());
    }

    // ── Disable 2FA ───────────────────────────────────────────────────────────
    public void disable(String userUuid, String totpCode) {
        User user = findUser(userUuid);
        if (!Boolean.TRUE.equals(user.getTwoFaEnabled())) throw new IllegalStateException("2FA is not currently enabled.");
        if (!codeVerifier.isValidCode(user.getTwoFaSecret(), totpCode)) throw new IllegalArgumentException("Invalid TOTP code.");

        user.setTwoFaEnabled(false);
        user.setTwoFaSecret(null);
        userRepository.save(user);
        log.info("2FA disabled for user: {}", user.getEmail());
    }

    // ── Validate after login (called with twoFaTempToken) ─────────────────────
    // Returns the UUID so the controller can build the full AuthResponse.
    public String validateAndGetUuid(String twoFaTempToken, String totpCode) {
        String userUuid = redisTemplate.opsForValue().get(TEMP_PREFIX + twoFaTempToken);
        if (userUuid == null) throw new IllegalArgumentException("2FA session expired or invalid. Please log in again.");

        User user = userRepository.findByUuid(userUuid)
                .orElseThrow(() -> new IllegalArgumentException("User not found."));

        if (!codeVerifier.isValidCode(user.getTwoFaSecret(), totpCode)) {
            throw new IllegalArgumentException("Invalid TOTP code.");
        }

        // Consume temp token — one-time use
        redisTemplate.delete(TEMP_PREFIX + twoFaTempToken);
        log.info("2FA validated for user: {}", user.getEmail());
        return userUuid;
    }

    public boolean isEnabled(String userUuid) {
        return Boolean.TRUE.equals(findUser(userUuid).getTwoFaEnabled());
    }

    // ── Helpers ───────────────────────────────────────────────────────────────
    private User findUser(String uuid) {
        return userRepository.findByUuid(uuid)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
    }

    private String generateQrBase64(QrData qrData) {
        try {
            return "data:image/png;base64," +
                    Base64.getEncoder().encodeToString(qrGenerator.generate(qrData));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate QR code", e);
        }
    }

    // ── Response DTO ──────────────────────────────────────────────────────────
    public record TwoFaSetupResponse(String secret, String otpauthUri, String qrCodeBase64) {}
}
