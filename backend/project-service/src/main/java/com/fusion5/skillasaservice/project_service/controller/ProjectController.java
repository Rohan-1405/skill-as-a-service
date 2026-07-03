package com.fusion5.skillasaservice.project_service.controller;
import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.project_service.entity.Project;
import com.fusion5.skillasaservice.project_service.service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/projects") @RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ApiResponse<Project>> create(@Valid @RequestBody CreateProjectRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Project created", projectService.create(req)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<Page<Project>>> myProjects(
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(ApiResponse.success("OK", projectService.myProjects(PageRequest.of(page, size, Sort.by("createdAt").descending()))));
    }
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> getById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("OK", projectService.getById(id)));
    }
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Project>> update(@PathVariable Long id, @RequestBody UpdateProjectRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Updated", projectService.update(id, req)));
    }
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<Project>> updateStatus(@PathVariable Long id, @Valid @RequestBody UpdateProjectStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", projectService.updateStatus(id, req)));
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long id) {
        projectService.delete(id); return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
