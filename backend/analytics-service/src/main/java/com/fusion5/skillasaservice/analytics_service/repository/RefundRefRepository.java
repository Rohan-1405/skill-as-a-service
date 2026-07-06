package com.fusion5.skillasaservice.analytics_service.repository;

import com.fusion5.skillasaservice.analytics_service.entity.RefundRef;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface RefundRefRepository extends JpaRepository<RefundRef, Long> {

    @Query("select coalesce(sum(r.amount), 0) from RefundRef r where r.status = 'COMPLETED'")
    BigDecimal totalRefunded();

    @Query("select r.status, count(r), coalesce(sum(r.amount),0) from RefundRef r group by r.status")
    List<Object[]> statusCountsAndSums();
}
