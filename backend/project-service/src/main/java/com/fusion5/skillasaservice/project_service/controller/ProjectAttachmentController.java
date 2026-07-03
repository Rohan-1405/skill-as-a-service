package com.fusion5.skillasaservice.project_service.controller;

import com.fusion5.skillasaservice.project_service.dto.request.AddAttachmentRequest;
import com.fusion5.skillasaservice.project_service.dto.response.ApiResponse;
import com.fusion5.skillasaservice.project_service.entity.ProjectAttachment;
import com.fusion5.skillasaservice.project_service.service.ProjectAttachmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * POST/GET /api/projects/{projectId}/attachments — metadata for files already hosted
 * elsewhere (e.g. a presigned S3/Wasabi URL). No binary upload here — see entity note.
 */
@RestController
@RequestMapping("/api/projects/{projectId}/attachments")
@RequiredArgsConstructor
public class ProjectAttachmentController {

    private final ProjectAttachmentService attachmentService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectAttachment>> add(
            @PathVariable Long projectId, @Valid @RequestBody AddAttachmentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Attachment added", attachmentService.add(projectId, req)));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectAttachment>>> list(@PathVariable Long projectId) {
        return ResponseEntity.ok(ApiResponse.success("OK", attachmentService.list(projectId)));
    }
}
