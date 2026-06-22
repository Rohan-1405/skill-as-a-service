package com.fusion5.skillasaservice.payment_service.exception;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String,Object>> handleNotFound(ResourceNotFoundException ex) { return b(HttpStatus.NOT_FOUND, ex.getMessage()); }
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<Map<String,Object>> handleBadRequest(BadRequestException ex) { return b(HttpStatus.BAD_REQUEST, ex.getMessage()); }
    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<Map<String,Object>> handleForbidden(ForbiddenException ex) { return b(HttpStatus.FORBIDDEN, ex.getMessage()); }
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String,Object>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String,String> fe = new HashMap<>();
        for (FieldError e : ex.getBindingResult().getFieldErrors()) fe.put(e.getField(), e.getDefaultMessage());
        Map<String,Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now()); body.put("status", 422);
        body.put("error", "Validation Failed"); body.put("fieldErrors", fe);
        return ResponseEntity.status(422).body(body);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String,Object>> handleGeneric(Exception ex) { return b(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error: " + ex.getMessage()); }
    private ResponseEntity<Map<String,Object>> b(HttpStatus s, String msg) {
        Map<String,Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now()); body.put("status", s.value());
        body.put("error", s.getReasonPhrase()); body.put("message", msg);
        return ResponseEntity.status(s).body(body);
    }
}
