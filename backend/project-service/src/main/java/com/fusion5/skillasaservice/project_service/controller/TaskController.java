package com.fusion5.skillasaservice.project_service.controller;
import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.project_service.entity.Task;
import com.fusion5.skillasaservice.project_service.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/projects/{projectId}/tasks") @RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;

    @PostMapping
    public ResponseEntity<ApiResponse<Task>> create(@PathVariable Long projectId, @Valid @RequestBody CreateTaskRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Task created", taskService.create(projectId, req)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<Task>>> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("OK", taskService.list(projectId)));
    }
    @PutMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Task>> update(@PathVariable Long projectId, @PathVariable Long taskId, @RequestBody UpdateTaskRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Updated", taskService.update(projectId, taskId, req)));
    }
    @PatchMapping("/{taskId}/status")
    public ResponseEntity<ApiResponse<Task>> updateStatus(@PathVariable Long projectId, @PathVariable Long taskId, @Valid @RequestBody UpdateTaskStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", taskService.updateStatus(projectId, taskId, req)));
    }
    @DeleteMapping("/{taskId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long projectId, @PathVariable Long taskId) {
        taskService.delete(projectId, taskId); return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
