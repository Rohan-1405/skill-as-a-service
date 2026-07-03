package com.fusion5.skillasaservice.project_service.service;
import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.entity.*;
import com.fusion5.skillasaservice.project_service.exception.*;
import com.fusion5.skillasaservice.project_service.repository.TaskRepository;
import com.fusion5.skillasaservice.project_service.security.CurrentUserResolver;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    private final ProjectService projectService;
    private final CurrentUserResolver currentUserResolver;

    @Transactional
    public Task create(Long projectId, CreateTaskRequest req) {
        projectService.getById(projectId);
        Long userId = currentUserResolver.getCurrentUserId();
        Task t = new Task();
        t.setProjectId(projectId); t.setCreatedBy(userId);
        t.setTitle(req.getTitle()); t.setDescription(req.getDescription());
        t.setMilestoneId(req.getMilestoneId()); t.setAssignedTo(req.getAssignedTo());
        t.setDueDate(req.getDueDate());
        try { t.setPriority(Task.Priority.valueOf(req.getPriority().toUpperCase())); }
        catch (Exception e) { t.setPriority(Task.Priority.MEDIUM); }
        return taskRepository.saveAndFlush(t);
    }

    public List<Task> list(Long projectId) { projectService.getById(projectId); return taskRepository.findByProjectIdOrderByCreatedAtDesc(projectId); }

    @Transactional
    public Task update(Long projectId, Long taskId, UpdateTaskRequest req) {
        projectService.getById(projectId);
        Task t = find(taskId, projectId);
        if (req.getTitle() != null)       t.setTitle(req.getTitle());
        if (req.getDescription() != null) t.setDescription(req.getDescription());
        if (req.getMilestoneId() != null) t.setMilestoneId(req.getMilestoneId());
        if (req.getAssignedTo() != null)  t.setAssignedTo(req.getAssignedTo());
        if (req.getDueDate() != null)     t.setDueDate(req.getDueDate());
        if (req.getPriority() != null) {
            try { t.setPriority(Task.Priority.valueOf(req.getPriority().toUpperCase())); }
            catch (Exception ignored) {}
        }
        return taskRepository.saveAndFlush(t);
    }

    @Transactional
    public Task updateStatus(Long projectId, Long taskId, UpdateTaskStatusRequest req) {
        projectService.getById(projectId);
        Task t = find(taskId, projectId);
        try { t.setStatus(Task.TaskStatus.valueOf(req.getStatus().toUpperCase())); }
        catch (IllegalArgumentException e) { throw new BadRequestException("Invalid status: " + req.getStatus()); }
        return taskRepository.saveAndFlush(t);
    }

    @Transactional
    public void delete(Long projectId, Long taskId) { projectService.getById(projectId); taskRepository.delete(find(taskId, projectId)); }

    private Task find(Long id, Long projectId) {
        return taskRepository.findById(id).filter(t -> t.getProjectId().equals(projectId))
                .orElseThrow(() -> new ResourceNotFoundException("Task not found: " + id));
    }
}
