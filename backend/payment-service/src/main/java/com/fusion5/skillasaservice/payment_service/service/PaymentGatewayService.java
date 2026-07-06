package com.fusion5.skillasaservice.payment_service.service;

import com.fusion5.skillasaservice.payment_service.dto.request.ConfigureGatewayRequest;
import com.fusion5.skillasaservice.payment_service.dto.request.CreateGatewayRequest;
import com.fusion5.skillasaservice.payment_service.dto.response.GatewayResponse;
import com.fusion5.skillasaservice.payment_service.entity.PaymentGateway;
import com.fusion5.skillasaservice.payment_service.exception.BadRequestException;
import com.fusion5.skillasaservice.payment_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.payment_service.repository.PaymentGatewayRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentGatewayService {

    private final PaymentGatewayRepository gatewayRepository;

    public List<GatewayResponse> listAll() {
        return gatewayRepository.findAll().stream()
                .map(GatewayResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public GatewayResponse create(CreateGatewayRequest req) {
        String key = req.getGatewayName().trim().toLowerCase();
        if (gatewayRepository.existsByGatewayName(key)) {
            throw new BadRequestException("Gateway '" + key + "' already exists — use configure instead");
        }
        PaymentGateway g = new PaymentGateway();
        g.setGatewayName(key);
        g.setDisplayName(req.getDisplayName());
        g.setApiKey(req.getApiKey());
        g.setApiSecret(req.getApiSecret());
        g.setWebhookSecret(req.getWebhookSecret());
        g.setConfig(req.getConfig());
        g.setEnabled(false); // must be explicitly enabled after creation
        PaymentGateway saved = gatewayRepository.saveAndFlush(g);
        log.info("Payment gateway '{}' created (disabled by default)", key);
        return GatewayResponse.from(saved);
    }

    @Transactional
    public GatewayResponse configure(Long id, ConfigureGatewayRequest req) {
        PaymentGateway g = find(id);
        if (req.getDisplayName() != null)   g.setDisplayName(req.getDisplayName());
        if (req.getApiKey() != null)        g.setApiKey(req.getApiKey());
        if (req.getApiSecret() != null)     g.setApiSecret(req.getApiSecret());
        if (req.getWebhookSecret() != null) g.setWebhookSecret(req.getWebhookSecret());
        if (req.getConfig() != null)        g.setConfig(req.getConfig());
        PaymentGateway saved = gatewayRepository.saveAndFlush(g);
        log.info("Payment gateway '{}' (id={}) reconfigured", g.getGatewayName(), id);
        return GatewayResponse.from(saved);
    }

    @Transactional
    public GatewayResponse enable(Long id) {
        PaymentGateway g = find(id);
        if (g.getApiKey() == null || g.getApiKey().isBlank()) {
            throw new BadRequestException("Cannot enable a gateway with no API key configured");
        }
        g.setEnabled(true);
        log.info("Payment gateway '{}' (id={}) ENABLED", g.getGatewayName(), id);
        return GatewayResponse.from(gatewayRepository.saveAndFlush(g));
    }

    @Transactional
    public GatewayResponse disable(Long id) {
        PaymentGateway g = find(id);
        g.setEnabled(false);
        log.info("Payment gateway '{}' (id={}) DISABLED", g.getGatewayName(), id);
        return GatewayResponse.from(gatewayRepository.saveAndFlush(g));
    }

    private PaymentGateway find(Long id) {
        return gatewayRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Payment gateway not found: " + id));
    }
}
