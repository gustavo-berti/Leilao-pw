package com.github.gustavo_berti.back_end.exception;

import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import com.github.gustavo_berti.back_end.dto.ErrorResponse;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.validation.ConstraintViolationException;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@RestControllerAdvice
public class GlobalExceptionHandler {

        @ExceptionHandler(NotFoundException.class)
        public ResponseEntity<ErrorResponse> notFoundException(NotFoundException ex, WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.NOT_FOUND.value(),
                                "Resource Not Found",
                                ex.getMessage(),
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
        }

        @ExceptionHandler(MethodArgumentNotValidException.class)
        public ResponseEntity<ErrorResponse> validation(MethodArgumentNotValidException ex, WebRequest request) {
                List<String> details = ex.getBindingResult().getFieldErrors().stream()
                                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                                .collect(Collectors.toList());
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Validation Error",
                                "Invalid input data",
                                request.getDescription(false),
                                details);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(BussinesException.class)
        public ResponseEntity<ErrorResponse> bussinesException(NotFoundException ex, WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Business Rule Violation",
                                ex.getMessage(),
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(Exception.class)
        public ResponseEntity<ErrorResponse> global(Exception ex, WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Internal Server Error",
                                ex.getMessage(),
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(UsernameNotFoundException.class)
        public ResponseEntity<ErrorResponse> usernameNotFoundException(UsernameNotFoundException ex,
                        WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.UNAUTHORIZED.value(),
                                "Authentication Error",
                                "Credenciais inválidas",
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(BadCredentialsException.class)
        public ResponseEntity<ErrorResponse> badCredentialsException(BadCredentialsException ex, WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.UNAUTHORIZED.value(),
                                "Authentication Error",
                                "Email ou senha incorretos",
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(AccessDeniedException.class)
        public ResponseEntity<ErrorResponse> accessDeniedException(AccessDeniedException ex, WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.FORBIDDEN.value(),
                                "Access Denied",
                                "Acesso negado. Você não tem permissão para acessar este recurso",
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
        }

        @ExceptionHandler(DataIntegrityViolationException.class)
        public ResponseEntity<ErrorResponse> dataIntegrityViolationException(DataIntegrityViolationException ex,
                        WebRequest request) {
                String message = "Violação de integridade de dados";
                if (ex.getMessage().contains("email")) {
                        message = "Este email já está em uso";
                }

                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.CONFLICT.value(),
                                "Data Integrity Violation",
                                message,
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
        }

        @ExceptionHandler(HttpMessageNotReadableException.class)
        public ResponseEntity<ErrorResponse> httpMessageNotReadableException(HttpMessageNotReadableException ex,
                        WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Malformed JSON",
                                "Formato JSON inválido",
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ConstraintViolationException.class)
        public ResponseEntity<ErrorResponse> constraintViolationException(ConstraintViolationException ex,
                        WebRequest request) {
                List<String> details = ex.getConstraintViolations().stream()
                                .map(violation -> violation.getPropertyPath() + ": " + violation.getMessage())
                                .collect(Collectors.toList());

                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.BAD_REQUEST.value(),
                                "Constraint Violation",
                                "Dados inválidos",
                                request.getDescription(false),
                                details);
                return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
        }

        @ExceptionHandler(ExpiredJwtException.class)
        public ResponseEntity<ErrorResponse> expiredJwtException(ExpiredJwtException ex, WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.UNAUTHORIZED.value(),
                                "Token Expired",
                                "Token expirado. Faça login novamente",
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }

        @ExceptionHandler(MalformedJwtException.class)
        public ResponseEntity<ErrorResponse> malformedJwtException(MalformedJwtException ex, WebRequest request) {
                ErrorResponse errorResponse = new ErrorResponse(
                                HttpStatus.UNAUTHORIZED.value(),
                                "Invalid Token",
                                "Token inválido",
                                request.getDescription(false),
                                null);
                return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
        }
}
