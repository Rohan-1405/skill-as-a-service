package com.fusion5.skillasaservice.project_service.controller;
import com.fusion5.skillasaservice.project_service.dto.request.CreateCommentRequest;
import com.fusion5.skillasaservice.project_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.project_service.entity.ProjectComment;
import com.fusion5.skillasaservice.project_service.service.ProjectCommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/projects/{projectId}/comments") @RequiredArgsConstructor
public class ProjectCommentController {
    private final ProjectCommentService commentService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectComment>> add(@PathVariable Long projectId, @Valid @RequestBody CreateCommentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Comment added", commentService.add(projectId, req)));
    }
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectComment>>> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("OK", commentService.list(projectId)));
    }
}
