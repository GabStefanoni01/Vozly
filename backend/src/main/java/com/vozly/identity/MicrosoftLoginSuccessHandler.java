package com.vozly.identity;

import java.io.IOException;
import java.time.Duration;
import java.util.UUID;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

@Component
public class MicrosoftLoginSuccessHandler implements AuthenticationSuccessHandler {
    private final AuthService authService;
    private final String frontendUrl;
    private final boolean secureCookie;

    public MicrosoftLoginSuccessHandler(AuthService authService,
            @Value("${vozly.security.frontend-url:http://localhost:4200}") String frontendUrl,
            @Value("${vozly.security.cookies.secure:true}") boolean secureCookie) {
        this.authService = authService;
        this.frontendUrl = frontendUrl;
        this.secureCookie = secureCookie;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {
        try {
            if (!(authentication.getPrincipal() instanceof OidcUser oidcUser)) {
                throw new IllegalStateException("A Microsoft não retornou uma identidade OIDC.");
            }
            String tenantClaim = oidcUser.getIdToken().getClaimAsString("tid");
            String issuer = oidcUser.getIdToken().getIssuer() == null ? null : oidcUser.getIdToken().getIssuer().toString();
            if (!isMicrosoftTenantIssuer(issuer, tenantClaim)) {
                throw new IllegalStateException("Emissor Microsoft inválido.");
            }
            String email = oidcUser.getClaimAsString("email");
            if (email == null || email.isBlank()) {
                email = oidcUser.getClaimAsString("preferred_username");
            }
            AuthService.AuthResult result = authService.loginMicrosoft(
                    issuer, oidcUser.getIdToken().getSubject(), email, oidcUser.getClaimAsString("name"),
                    request.getHeader("User-Agent"), request.getRemoteAddr());

            ResponseCookie refreshCookie = ResponseCookie.from("vozly_refresh", result.refreshToken())
                    .httpOnly(true).secure(secureCookie).sameSite("Strict")
                    .path("/api/v1/auth").maxAge(Duration.ofDays(30)).build();
            response.addHeader("Set-Cookie", refreshCookie.toString());
            response.sendRedirect(UriComponentsBuilder.fromUriString(frontendUrl)
                    .path("/auth/sso/callback").build().toUriString());
        } catch (RuntimeException exception) {
            response.sendRedirect(UriComponentsBuilder.fromUriString(frontendUrl)
                    .path("/login").queryParam("error", "microsoft_sso_failed").build().toUriString());
        }
    }

    private boolean isMicrosoftTenantIssuer(String issuer, String tenantId) {
        if (issuer == null || tenantId == null) return false;
        try {
            UUID.fromString(tenantId);
        } catch (IllegalArgumentException exception) {
            return false;
        }
        return issuer.equals("https://login.microsoftonline.com/" + tenantId + "/v2.0");
    }
}
