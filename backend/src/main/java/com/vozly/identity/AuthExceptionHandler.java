package com.vozly.identity;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class)
    ResponseEntity<Map<String, String>> badCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("code", "INVALID_CREDENTIALS", "message", "Credenciais ou sessão inválidas."));
    }

    @ExceptionHandler(AuthService.EmailAlreadyRegisteredException.class)
    ResponseEntity<Map<String, String>> duplicateEmail() {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("code", "EMAIL_ALREADY_REGISTERED", "message", "Não foi possível concluir o cadastro com esses dados."));
    }

    @ExceptionHandler(AuthService.AccountLinkRequiredException.class)
    ResponseEntity<Map<String, String>> accountLinkRequired() {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("code", "ACCOUNT_LINK_REQUIRED", "message", "Entre pela forma original de acesso para vincular a conta Microsoft."));
    }


    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<Map<String, String>> dataConflict() {
        return ResponseEntity.status(HttpStatus.CONFLICT)
                .body(Map.of("code", "RESOURCE_CONFLICT", "message", "Não foi possível concluir a operação por conflito de dados."));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<Map<String, String>> validation(MethodArgumentNotValidException exception) {
        return ResponseEntity.badRequest()
                .body(Map.of("code", "VALIDATION_ERROR", "message", "Revise os campos enviados."));
    }
}
