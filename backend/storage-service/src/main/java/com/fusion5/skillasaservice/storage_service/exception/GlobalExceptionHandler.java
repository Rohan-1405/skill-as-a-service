package com.fusion5.skillasaservice.storage_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String,Object>> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.badRequest().body(error(ex.getMessage(), 400));
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String,Object>> handleForbidden(ForbiddenException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error(ex.getMessage(), 403));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String,Object>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(error("You do not have permission to access this resource", 403));
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error(ex.getMessage(), 404));
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<Map<String,Object>> handleTooLarge(MaxUploadSizeExceededException ex) {
        return ResponseEntity.status(HttpStatus.PAYLOAD_TOO_LARGE)
                .body(error("File exceeds the maximum allowed upload size", 413));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleGeneric(Exception ex) {
        return ResponseEntity.internalServerError().body(error("Internal server error: " + ex.getMessage(), 500));
    }

    private Map<String,Object> error(String msg, int code) {
        return Map.of("success", false, "message", msg, "status", code, "timestamp", LocalDateTime.now().toString());
    }
}
