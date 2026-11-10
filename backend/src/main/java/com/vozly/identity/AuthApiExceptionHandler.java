package com.vozly.identity;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class AuthApiExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<Map<String, String>> invalidCredentials() {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of(
                "error", "invalid_credentials",
                "message", "Não foi possível autenticar com os dados informados."
        ));
    }

    @ExceptionHandler(AuthService.EmailAlreadyRegisteredException.class)
    public ResponseEntity<Map<String, String>> registrationNotCompleted() {
        return ResponseEntity.badRequest().body(Map.of(
                "error", "registration_not_completed",
                "message", "Não foi possível concluir o cadastro com os dados informados."
        ));
    }
}
