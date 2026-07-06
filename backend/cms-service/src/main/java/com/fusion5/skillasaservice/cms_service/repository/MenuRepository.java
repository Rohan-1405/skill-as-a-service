package com.fusion5.skillasaservice.cms_service.repository;
import com.fusion5.skillasaservice.cms_service.entity.Menu;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface MenuRepository extends JpaRepository<Menu, Long> {
    Optional<Menu> findByMenuName(String menuName);
    boolean existsByMenuName(String menuName);
}
