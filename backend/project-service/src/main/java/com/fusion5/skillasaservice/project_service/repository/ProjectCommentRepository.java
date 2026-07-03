package com.fusion5.skillasaservice.project_service.repository;
import com.fusion5.skillasaservice.project_service.entity.ProjectComment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ProjectCommentRepository extends JpaRepository<ProjectComment, Long> {
    List<ProjectComment> findByProjectIdOrderByCreatedAtAsc(Long projectId);
}
