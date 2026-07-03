package com.fusion5.skillasaservice.wallet_service.repository;

import com.fusion5.skillasaservice.wallet_service.entity.Withdrawal;
import com.fusion5.skillasaservice.wallet_service.entity.Withdrawal.WithdrawalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface WithdrawalRepository extends JpaRepository<Withdrawal, Long> {
    Page<Withdrawal> findByUserId(Long userId, Pageable pageable);
    Page<Withdrawal> findByStatus(WithdrawalStatus status, Pageable pageable);
    List<Withdrawal> findByStatus(WithdrawalStatus status);   // used by auto-payout scheduler
}
