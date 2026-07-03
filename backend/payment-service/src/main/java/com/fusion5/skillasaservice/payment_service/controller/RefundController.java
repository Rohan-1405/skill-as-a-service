package com.fusion5.skillasaservice.payment_service.controller;

import com.fusion5.skillasaservice.payment_service.dto.request.RefundRequest;
import com.fusion5.skillasaservice.payment_service.entity.Refund;
import com.fusion5.skillasaservice.payment_service.service.RefundService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment/refunds")
@RequiredArgsConstructor
public class RefundController {

    private final RefundService refundService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('CLIENT', 'ADMIN', 'SUPER_ADMIN')")
    public Refund initiate(@Valid @RequestBody RefundRequest request) {
        return refundService.initiateRefund(request);
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    public Page<Refund> listAll(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return refundService.listAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    @GetMapping("/{id}")
    public Refund getById(@PathVariable Long id) {
        return refundService.getById(id);
    }
}
