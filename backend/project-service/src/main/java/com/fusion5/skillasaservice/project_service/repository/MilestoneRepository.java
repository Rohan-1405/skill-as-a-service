package com.fusion5.skillasaservice.project_service.repository;
import com.fusion5.skillasaservice.project_service.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface MilestoneRepository extends JpaRepository<Milestone, Long> {
    List<Milestone> findByProjectIdOrderByDueDateAsc(Long projectId);
}
