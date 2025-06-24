package com.github.gustavo_berti.back_end.exception;

public class NotFoundException extends RuntimeException {
    public NotFoundException(String message) {
        super(message);
    }  
}
