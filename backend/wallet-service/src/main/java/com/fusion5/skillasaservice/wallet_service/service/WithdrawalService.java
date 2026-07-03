package com.fusion5.skillasaservice.wallet_service.service;

import com.fusion5.skillasaservice.wallet_service.dto.request.WithdrawalRejectRequest;
import com.fusion5.skillasaservice.wallet_service.dto.request.WithdrawalRequest;
import com.fusion5.skillasaservice.wallet_service.entity.Wallet;
import com.fusion5.skillasaservice.wallet_service.entity.WalletTransaction;
import com.fusion5.skillasaservice.wallet_service.entity.Withdrawal;
import com.fusion5.skillasaservice.wallet_service.entity.Withdrawal.WithdrawalStatus;
import com.fusion5.skillasaservice.wallet_service.exception.BadRequestException;
import com.fusion5.skillasaservice.wallet_service.exception.ForbiddenException;
import com.fusion5.skillasaservice.wallet_service.exception.ResourceNotFoundException;
import com.fusion5.skillasaservice.wallet_service.repository.WalletRepository;
import com.fusion5.skillasaservice.wallet_service.repository.WalletTransactionRepository;
import com.fusion5.skillasaservice.wallet_service.repository.WithdrawalRepository;
import com.fusion5.skillasaservice.wallet_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class WithdrawalService {

    private final WithdrawalRepository       withdrawalRepository;
    private final WalletRepository           walletRepository;
    private final WalletTransactionRepository transactionRepository;
    private final CurrentUserResolver         currentUserResolver;

    // ── Freelancer: submit a withdrawal request ───────────────────────────────
    @Transactional
    public Withdrawal requestWithdrawal(WithdrawalRequest req) {
        Long userId = currentUserResolver.getCurrentUserId();

        Wallet wallet = walletRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));

        if (wallet.getBalance().compareTo(req.getAmount()) < 0) {
            throw new BadRequestException(
                    "Insufficient balance. Available: " + wallet.getBalance() +
                    ", Requested: " + req.getAmount());
        }

        // Deduct from wallet immediately (funds reserved)
        wallet.setBalance(wallet.getBalance().subtract(req.getAmount()));
        walletRepository.saveAndFlush(wallet);

        // Record the deduction
        recordTx(wallet.getId(), WalletTransaction.TransactionType.WITHDRAWAL,
                req.getAmount(), null, "Withdrawal request pending admin approval");

        Withdrawal w = new Withdrawal();
        w.setUserId(userId);
        w.setAmount(req.getAmount());
        w.setPayoutMethod(req.getPayoutMethod());
        w.setPayoutDetails(req.getPayoutDetails());
        w.setStatus(WithdrawalStatus.PENDING);
        return withdrawalRepository.save(w);
    }

    // ── Freelancer: view own withdrawal history ───────────────────────────────
    public Page<Withdrawal> myWithdrawals(Pageable pageable) {
        Long userId = currentUserResolver.getCurrentUserId();
        return withdrawalRepository.findByUserId(userId, pageable);
    }

    // ── Admin: list all withdrawals (optional status filter) ──────────────────
    public Page<Withdrawal> listAll(String status, Pageable pageable) {
        if (status != null) {
            WithdrawalStatus ws;
            try {
                ws = WithdrawalStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid status. Valid: PENDING, APPROVED, REJECTED, PROCESSED, FAILED");
            }
            return withdrawalRepository.findByStatus(ws, pageable);
        }
        return withdrawalRepository.findAll(pageable);
    }

    // ── Admin: approve withdrawal (auto-payout scheduler picks it up) ─────────
    @Transactional
    public Withdrawal approve(Long withdrawalId) {
        Long adminId = currentUserResolver.getCurrentUserId();
        Withdrawal w = findWithdrawal(withdrawalId);
        if (w.getStatus() != WithdrawalStatus.PENDING) {
            throw new BadRequestException("Only PENDING withdrawals can be approved");
        }
        w.setStatus(WithdrawalStatus.APPROVED);
        w.setReviewedAt(LocalDateTime.now());
        w.setReviewedBy(adminId);
        log.info("Withdrawal {} approved by admin {}", withdrawalId, adminId);
        return withdrawalRepository.saveAndFlush(w);
    }

    // ── Admin: reject withdrawal (refund balance) ─────────────────────────────
    @Transactional
    public Withdrawal reject(Long withdrawalId, WithdrawalRejectRequest req) {
        Long adminId = currentUserResolver.getCurrentUserId();
        Withdrawal w = findWithdrawal(withdrawalId);
        if (w.getStatus() != WithdrawalStatus.PENDING) {
            throw new BadRequestException("Only PENDING withdrawals can be rejected");
        }

        // Refund balance
        Wallet wallet = walletRepository.findByUserId(w.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Wallet not found"));
        wallet.setBalance(wallet.getBalance().add(w.getAmount()));
        walletRepository.saveAndFlush(wallet);
        recordTx(wallet.getId(), WalletTransaction.TransactionType.CREDIT,
                w.getAmount(), null, "Withdrawal rejected — funds returned: " + req.getReason());

        w.setStatus(WithdrawalStatus.REJECTED);
        w.setRejectionReason(req.getReason());
        w.setReviewedAt(LocalDateTime.now());
        w.setReviewedBy(adminId);
        log.info("Withdrawal {} rejected by admin {}: {}", withdrawalId, adminId, req.getReason());
        return withdrawalRepository.saveAndFlush(w);
    }

    // ── Gap #27: Auto-Payout Scheduler ───────────────────────────────────────
    // Runs every 30 minutes. Picks up APPROVED withdrawals and marks them PROCESSED.
    // Phase 2: replace the UUID reference with real Razorpay X / NEFT / UPI API call.
    //
    // IMPORTANT: Add @EnableScheduling to WalletServiceApplication:
    //   @EnableScheduling
    //   @SpringBootApplication
    //   public class WalletServiceApplication { ... }
    @Scheduled(fixedDelayString = "${app.autopayout.interval-ms:1800000}")
    @Transactional
    public void processApprovedWithdrawals() {
        List<Withdrawal> approved = withdrawalRepository.findByStatus(WithdrawalStatus.APPROVED);
        if (approved.isEmpty()) return;

        log.info("Auto-payout: processing {} approved withdrawal(s)", approved.size());
        for (Withdrawal w : approved) {
            try {
                // Phase 2: call actual payout API here based on w.getPayoutMethod()
                String ref = "PAYOUT-" + w.getId() + "-"
                        + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
                w.setPayoutReference(ref);
                w.setStatus(WithdrawalStatus.PROCESSED);
                withdrawalRepository.saveAndFlush(w);
                log.info("Withdrawal {} processed: ref={}", w.getId(), ref);
            } catch (Exception e) {
                w.setStatus(WithdrawalStatus.FAILED);
                withdrawalRepository.saveAndFlush(w);
                log.error("Withdrawal {} failed during auto-payout: {}", w.getId(), e.getMessage());
            }
        }
    }

    private Withdrawal findWithdrawal(Long id) {
        return withdrawalRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Withdrawal not found: " + id));
    }

    private void recordTx(Long walletId, WalletTransaction.TransactionType type,
                           BigDecimal amount, String referenceId, String description) {
        WalletTransaction tx = new WalletTransaction();
        tx.setWalletId(walletId);
        tx.setTransactionType(type);
        tx.setAmount(amount);
        tx.setReferenceId(referenceId);
        tx.setDescription(description);
        transactionRepository.save(tx);
    }
}
