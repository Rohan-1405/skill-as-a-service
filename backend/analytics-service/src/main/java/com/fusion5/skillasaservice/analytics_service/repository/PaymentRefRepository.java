package com.fusion5.skillasaservice.analytics_service.repository;

import com.fusion5.skillasaservice.analytics_service.entity.PaymentRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public interface PaymentRefRepository extends JpaRepository<PaymentRef, Long> {

    @Query("select coalesce(sum(p.amount), 0) from PaymentRef p where p.payeeId = :userId and p.status = 'COMPLETED'")
    BigDecimal totalEarningsForFreelancer(@Param("userId") Long userId);

    @Query("select coalesce(sum(p.amount), 0) from PaymentRef p where p.payerId = :userId and p.status = 'COMPLETED'")
    BigDecimal totalSpentByClient(@Param("userId") Long userId);

    long countByPayeeIdAndStatus(Long payeeId, PaymentRef.PaymentStatus status);
    long countByPayerIdAndStatus(Long payerId, PaymentRef.PaymentStatus status);

    @Query(value = "select DATE_FORMAT(created_at, '%Y-%m') as month, coalesce(sum(amount),0) as total " +
            "from payments where payee_id = :userId and status = 'COMPLETED' and created_at >= :since " +
            "group by month order by month", nativeQuery = true)
    List<Object[]> monthlyEarnings(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query(value = "select DATE_FORMAT(created_at, '%Y-%m') as month, coalesce(sum(amount),0) as total " +
            "from payments where payer_id = :userId and status = 'COMPLETED' and created_at >= :since " +
            "group by month order by month", nativeQuery = true)
    List<Object[]> monthlySpending(@Param("userId") Long userId, @Param("since") LocalDateTime since);

    @Query("select coalesce(sum(p.amount), 0) from PaymentRef p where p.status = 'COMPLETED'")
    BigDecimal platformTotalRevenue();

    @Query(value = "select DATE_FORMAT(created_at, '%Y-%m') as month, coalesce(sum(amount),0) as total " +
            "from payments where status = 'COMPLETED' and created_at >= :since " +
            "group by month order by month", nativeQuery = true)
    List<Object[]> monthlyPlatformRevenue(@Param("since") LocalDateTime since);

    @Query("select p.status, count(p), coalesce(sum(p.amount),0) from PaymentRef p group by p.status")
    List<Object[]> statusCountsAndSums();
}
