package com.github.gustavo_berti.back_end.dto;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class ErrorResponse {
    private LocalDateTime timestamp;
    private int httpCode;
    private String error;
    private String message;
    private String path;
    private List<String> details;

    public ErrorResponse(int httpCode, String error, String message, String path, List<String> details) {
        this.timestamp = LocalDateTime.now();
        this.httpCode = httpCode;
        this.error = error;
        this.message = message;
        this.path = path;
        this.details = details;
    }
}
