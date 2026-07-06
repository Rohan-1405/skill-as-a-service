package com.fusion5.skillasaservice.cms_service.repository;
import com.fusion5.skillasaservice.cms_service.entity.Faq;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface FaqRepository extends JpaRepository<Faq, Long> {
    List<Faq> findByActiveTrueOrderBySortOrderAsc();
}
