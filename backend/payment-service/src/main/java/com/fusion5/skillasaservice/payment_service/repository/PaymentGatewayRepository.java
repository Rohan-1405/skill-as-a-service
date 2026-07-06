package com.fusion5.skillasaservice.payment_service.repository;

import com.fusion5.skillasaservice.payment_service.entity.PaymentGateway;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PaymentGatewayRepository extends JpaRepository<PaymentGateway, Long> {
    Optional<PaymentGateway> findByGatewayName(String gatewayName);
    boolean existsByGatewayName(String gatewayName);
}
