package com.fusion5.skillasaservice.wallet_service.controller;

import com.fusion5.skillasaservice.wallet_service.dto.request.WithdrawalRequest;
import com.fusion5.skillasaservice.wallet_service.entity.Withdrawal;
import com.fusion5.skillasaservice.wallet_service.service.WithdrawalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wallet")
@RequiredArgsConstructor
public class WithdrawalController {

    private final WithdrawalService withdrawalService;

    /**
     * POST /api/wallet/withdraw
     * Freelancer submits a withdrawal request.
     * Funds are deducted from wallet immediately (reserved).
     * Admin approval triggers payout (auto-payout scheduler runs every 30 min).
     */
    @PostMapping("/withdraw")
    @PreAuthorize("hasRole('FREELANCER')")
    @ResponseStatus(HttpStatus.CREATED)
    public Withdrawal requestWithdrawal(@Valid @RequestBody WithdrawalRequest request) {
        return withdrawalService.requestWithdrawal(request);
    }

    /**
     * GET /api/wallet/withdrawals
     * Freelancer views their own withdrawal history.
     */
    @GetMapping("/withdrawals")
    @PreAuthorize("hasRole('FREELANCER')")
    public Page<Withdrawal> myWithdrawals(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "10") int size) {
        return withdrawalService.myWithdrawals(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }
}
