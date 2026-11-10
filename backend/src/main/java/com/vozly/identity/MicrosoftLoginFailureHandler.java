package com.vozly.identity;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class MicrosoftLoginFailureHandler implements AuthenticationFailureHandler {
    private final String frontendUrl;

    public MicrosoftLoginFailureHandler(
            @Value("${vozly.security.frontend-url:http://localhost:4200}") String frontendUrl) {
        this.frontendUrl = frontendUrl;
    }

    @Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
                                        AuthenticationException exception) throws IOException, ServletException {
        response.setHeader("Cache-Control", "no-store");
        response.setHeader("Pragma", "no-cache");
        response.sendRedirect(UriComponentsBuilder.fromUriString(frontendUrl)
                .path("/login").queryParam("error", "microsoft_sso_failed").build().toUriString());
    }
}
