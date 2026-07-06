package com.fusion5.skillasaservice.wallet_service.controller;

import com.fusion5.skillasaservice.wallet_service.dto.request.WithdrawalRejectRequest;
import com.fusion5.skillasaservice.wallet_service.entity.Withdrawal;
import com.fusion5.skillasaservice.wallet_service.service.WithdrawalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/wallet")
@RequiredArgsConstructor
public class AdminWalletController {

    private final WithdrawalService withdrawalService;

    /**
     * GET /api/admin/wallet/withdrawals
     * List all withdrawal requests, optionally filtered by status.
     * Query: ?status=PENDING  (PENDING | APPROVED | REJECTED | PROCESSED | FAILED)
     */
    @GetMapping("/withdrawals")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_WITHDRAWALS')")
    public Page<Withdrawal> listAll(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {
        return withdrawalService.listAll(status,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
    }

    /**
     * PATCH /api/admin/wallet/withdrawals/{id}/approve
     * Approve a PENDING withdrawal — auto-payout scheduler processes it next run.
     */
    @PatchMapping("/withdrawals/{id}/approve")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_WITHDRAWALS')")
    public Withdrawal approve(@PathVariable Long id) {
        return withdrawalService.approve(id);
    }

    /**
     * PATCH /api/admin/wallet/withdrawals/{id}/reject
     * Reject a PENDING withdrawal — funds are returned to freelancer's wallet.
     * Body: { "reason": "..." }
     */
    @PatchMapping("/withdrawals/{id}/reject")
    @PreAuthorize("hasRole('SUPER_ADMIN') or hasAuthority('PERM_WITHDRAWALS')")
    public Withdrawal reject(
            @PathVariable Long id,
            @Valid @RequestBody WithdrawalRejectRequest request) {
        return withdrawalService.reject(id, request);
    }
}
