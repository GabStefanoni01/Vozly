package com.vozly.identity;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;

class AuthExceptionHandlerTests {
    private final AuthExceptionHandler handler = new AuthExceptionHandler();

    @Test
    void invalidCredentialsUseOneGenericUnauthorizedResponse() {
        ResponseEntity<Map<String, String>> response =
                handler.badCredentials(new BadCredentialsException("invalid"));

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody())
                .containsEntry("code", "INVALID_CREDENTIALS")
                .containsEntry("message", "Credenciais ou sessão inválidas.");
    }

    @Test
    void duplicateEmailUsesGenericConflictResponse() {
        ResponseEntity<Map<String, String>> response =
                handler.duplicateEmail(new AuthService.EmailAlreadyRegisteredException());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody())
                .containsEntry("code", "EMAIL_ALREADY_REGISTERED")
                .containsEntry("message", "Não foi possível concluir o cadastro com esses dados.");
    }

    @Test
    void microsoftAccountLinkRequirementUsesConflictResponse() {
        ResponseEntity<Map<String, String>> response =
                handler.accountLinkRequired(new AuthService.AccountLinkRequiredException());

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).containsEntry("code", "ACCOUNT_LINK_REQUIRED");
    }
}