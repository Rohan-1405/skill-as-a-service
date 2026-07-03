package com.fusion5.skillasaservice.payment_service.repository;

import com.fusion5.skillasaservice.payment_service.entity.Refund;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RefundRepository extends JpaRepository<Refund, Long> {
    Page<Refund> findByInitiatedBy(Long userId, Pageable pageable);
}
