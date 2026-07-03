package com.fusion5.skillasaservice.project_service.controller;
import com.fusion5.skillasaservice.project_service.dto.request.*;
import com.fusion5.skillasaservice.project_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.project_service.entity.Milestone;
import com.fusion5.skillasaservice.project_service.service.MilestoneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/projects/{projectId}/milestones") @RequiredArgsConstructor
public class MilestoneController {
    private final MilestoneService milestoneService;

    @PostMapping
    public ResponseEntity<ApiResponse<Milestone>> create(@PathVariable Long projectId, @Valid @RequestBody CreateMilestoneRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Milestone created", milestoneService.create(projectId, req)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<Milestone>>> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("OK", milestoneService.list(projectId)));
    }
    @PutMapping("/{milestoneId}")
    public ResponseEntity<ApiResponse<Milestone>> update(@PathVariable Long projectId, @PathVariable Long milestoneId, @RequestBody UpdateMilestoneRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Updated", milestoneService.update(projectId, milestoneId, req)));
    }
    @PatchMapping("/{milestoneId}/status")
    public ResponseEntity<ApiResponse<Milestone>> updateStatus(@PathVariable Long projectId, @PathVariable Long milestoneId, @Valid @RequestBody UpdateMilestoneStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.success("Status updated", milestoneService.updateStatus(projectId, milestoneId, req.getStatus())));
    }
    @DeleteMapping("/{milestoneId}")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable Long projectId, @PathVariable Long milestoneId) {
        milestoneService.delete(projectId, milestoneId); return ResponseEntity.ok(ApiResponse.success("Deleted", null));
    }
}
