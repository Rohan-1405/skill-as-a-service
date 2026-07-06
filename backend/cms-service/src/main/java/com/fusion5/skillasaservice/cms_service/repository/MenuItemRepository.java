package com.fusion5.skillasaservice.cms_service.repository;
import com.fusion5.skillasaservice.cms_service.entity.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findByMenuIdOrderBySortOrderAsc(Long menuId);
    void deleteByMenuId(Long menuId);
}
