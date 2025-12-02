package com.github.gustavo_berti.back_end.exception;

public class BidValidationException extends RuntimeException {
    public BidValidationException(String message) {
        super(message);
    }
}