package com.fusion5.skillasaservice.payment_service.controller;

import com.fusion5.skillasaservice.payment_service.dto.request.ConfigureGatewayRequest;
import com.fusion5.skillasaservice.payment_service.dto.request.CreateGatewayRequest;
import com.fusion5.skillasaservice.payment_service.dto.response.GatewayResponse;
import com.fusion5.skillasaservice.payment_service.service.PaymentGatewayService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/payment/gateways")
@RequiredArgsConstructor
@PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_PAYMENTS')")
public class PaymentGatewayController {

    private final PaymentGatewayService gatewayService;

    @GetMapping
    public List<GatewayResponse> listAll() {
        return gatewayService.listAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GatewayResponse create(@Valid @RequestBody CreateGatewayRequest request) {
        return gatewayService.create(request);
    }

    @PutMapping("/{id}/configure")
    public GatewayResponse configure(@PathVariable Long id, @Valid @RequestBody ConfigureGatewayRequest request) {
        return gatewayService.configure(id, request);
    }

    @PatchMapping("/{id}/enable")
    public GatewayResponse enable(@PathVariable Long id) {
        return gatewayService.enable(id);
    }

    @PatchMapping("/{id}/disable")
    public GatewayResponse disable(@PathVariable Long id) {
        return gatewayService.disable(id);
    }
}
