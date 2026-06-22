package com.fusion5.skillasaservice.wallet_service.controller;

import com.fusion5.skillasaservice.wallet_service.dto.request.DepositRequest;
import com.fusion5.skillasaservice.wallet_service.dto.response.WalletResponse;
import com.fusion5.skillasaservice.wallet_service.dto.response.WalletTransactionResponse;
import com.fusion5.skillasaservice.wallet_service.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    // Day 7 - Wallet APIs
    // GET /api/wallet/me - get current user's wallet (auto-creates on first call)
    @GetMapping("/me")
    public WalletResponse getMyWallet() {
        return walletService.getMyWallet();
    }

    // POST /api/wallet/deposit - manual top-up (for future gateway integration)
    @PostMapping("/deposit")
    public WalletResponse deposit(@Valid @RequestBody DepositRequest request) {
        return walletService.deposit(request);
    }

    // Day 7 - Transaction APIs
    // GET /api/wallet/transactions - full transaction history, newest first
    @GetMapping("/transactions")
    public List<WalletTransactionResponse> getTransactions() {
        return walletService.getMyTransactions();
    }
}
