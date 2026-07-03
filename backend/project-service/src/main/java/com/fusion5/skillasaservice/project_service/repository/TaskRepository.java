package com.fusion5.skillasaservice.project_service.repository;
import com.fusion5.skillasaservice.project_service.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByProjectIdOrderByCreatedAtDesc(Long projectId);
    List<Task> findByProjectIdAndMilestoneId(Long projectId, Long milestoneId);
    List<Task> findByAssignedTo(Long userId);
}
