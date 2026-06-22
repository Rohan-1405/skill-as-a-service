package com.fusion5.skillasaservice.payment_service.repository;
import com.fusion5.skillasaservice.payment_service.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
    List<Invoice> findByClientIdOrderByCreatedAtDesc(Long clientId);
    List<Invoice> findByFreelancerIdOrderByCreatedAtDesc(Long freelancerId);
}
