package com.fusion5.skillasaservice.wallet_service.service;

import com.fusion5.skillasaservice.wallet_service.dto.request.DepositRequest;
import com.fusion5.skillasaservice.wallet_service.dto.response.WalletResponse;
import com.fusion5.skillasaservice.wallet_service.dto.response.WalletTransactionResponse;
import com.fusion5.skillasaservice.wallet_service.entity.Wallet;
import com.fusion5.skillasaservice.wallet_service.entity.WalletTransaction;
import com.fusion5.skillasaservice.wallet_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.wallet_service.messaging.PaymentCompletedEvent;
import com.fusion5.skillasaservice.wallet_service.repository.WalletRepository;
import com.fusion5.skillasaservice.wallet_service.repository.WalletTransactionRepository;
import com.fusion5.skillasaservice.wallet_service.security.CurrentUserResolver;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final CurrentUserResolver currentUserResolver;

    @Value("${app.platform.fee.percentage:10}")
    private int platformFeePercentage;

    public WalletService(WalletRepository walletRepository,
                          WalletTransactionRepository transactionRepository,
                          CurrentUserResolver currentUserResolver) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.currentUserResolver = currentUserResolver;
    }

    // Auto-creates wallet on first access (no separate "create wallet" API needed)
    public WalletResponse getMyWallet() {
        Long userId = currentUserResolver.getCurrentUserId();
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createWallet(userId));
        return toResponse(wallet);
    }

    @Transactional
    public WalletResponse deposit(DepositRequest request) {
        Long userId = currentUserResolver.getCurrentUserId();
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseGet(() -> createWallet(userId));

        wallet.setBalance(wallet.getBalance().add(request.getAmount()));
        Wallet saved = walletRepository.saveAndFlush(wallet);

        recordTransaction(wallet.getId(), WalletTransaction.TransactionType.DEPOSIT,
                request.getAmount(), null, "Manual wallet top-up");

        return toResponse(saved);
    }

    public List<WalletTransactionResponse> getMyTransactions() {
        Long userId = currentUserResolver.getCurrentUserId();
        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found for current user"));

        return transactionRepository.findByWalletIdOrderByCreatedAtDesc(wallet.getId())
                .stream().map(this::toTransactionResponse).toList();
    }

    /**
     * Called by the RabbitMQ listener when a payment.completed event arrives.
     * Credits the freelancer's wallet with (amount - platform fee).
     * The client does NOT get their wallet touched here — subscription payments
     * go direct through the payment gateway, not through the wallet.
     */
    @Transactional
    public void creditFreelancerWallet(PaymentCompletedEvent event) {
        BigDecimal fee = event.getAmount()
                .multiply(BigDecimal.valueOf(platformFeePercentage))
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        BigDecimal credit = event.getAmount().subtract(fee);

        Wallet wallet = walletRepository.findByUserId(event.getFreelancerId())
                .orElseGet(() -> createWallet(event.getFreelancerId()));

        wallet.setBalance(wallet.getBalance().add(credit));
        walletRepository.saveAndFlush(wallet);

        recordTransaction(wallet.getId(), WalletTransaction.TransactionType.CREDIT,
                credit, event.getRazorpayPaymentId(),
                "Subscription payment received (platform fee " + platformFeePercentage + "% deducted)");
    }

    private Wallet createWallet(Long userId) {
        Wallet w = new Wallet();
        w.setUserId(userId);
        w.setBalance(BigDecimal.ZERO);
        w.setCurrency("INR");
        return walletRepository.saveAndFlush(w);
    }

    private void recordTransaction(Long walletId, WalletTransaction.TransactionType type,
                                    BigDecimal amount, String referenceId, String description) {
        WalletTransaction tx = new WalletTransaction();
        tx.setWalletId(walletId);
        tx.setTransactionType(type);
        tx.setAmount(amount);
        tx.setReferenceId(referenceId);
        tx.setDescription(description);
        transactionRepository.save(tx);
    }

    private WalletResponse toResponse(Wallet w) {
        return WalletResponse.builder()
                .id(w.getId()).userId(w.getUserId()).balance(w.getBalance())
                .currency(w.getCurrency()).createdAt(w.getCreatedAt()).updatedAt(w.getUpdatedAt())
                .build();
    }

    private WalletTransactionResponse toTransactionResponse(WalletTransaction tx) {
        return WalletTransactionResponse.builder()
                .id(tx.getId()).walletId(tx.getWalletId()).transactionType(tx.getTransactionType())
                .amount(tx.getAmount()).referenceId(tx.getReferenceId())
                .description(tx.getDescription()).createdAt(tx.getCreatedAt())
                .build();
    }
}
