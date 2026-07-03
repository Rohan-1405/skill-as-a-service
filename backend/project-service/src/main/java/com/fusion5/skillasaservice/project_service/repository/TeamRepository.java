package com.fusion5.skillasaservice.project_service.repository;
import com.fusion5.skillasaservice.project_service.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByProjectId(Long projectId);
    boolean existsByProjectId(Long projectId);
}
