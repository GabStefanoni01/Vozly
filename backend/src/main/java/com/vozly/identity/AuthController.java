package com.vozly.identity;

import java.time.Duration;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private static final String REFRESH_COOKIE = "vozly_refresh";
    private final AuthService authService;
    private final JdbcTemplate jdbc;
    private final boolean secureCookie;

    public AuthController(AuthService authService, JdbcTemplate jdbc,
                          @Value("${vozly.security.cookies.secure:true}") boolean secureCookie) {
        this.authService = authService;
        this.jdbc = jdbc;
        this.secureCookie = secureCookie;
    }

    @GetMapping("/csrf")
    public ResponseEntity<Map<String, String>> csrf(HttpServletRequest request) {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        return ResponseEntity.ok().header(HttpHeaders.CACHE_CONTROL, "no-store")
                .header(HttpHeaders.PRAGMA, "no-cache").body(Map.of("token", csrfToken.getToken()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request,
                                      HttpServletRequest servletRequest) {
        AuthService.AuthResult result = authService.register(request.name(), request.email(),
                request.password(), request.workspaceName(), servletRequest.getHeader("User-Agent"),
                servletRequest.getRemoteAddr());
        return authenticatedResponse(result);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request,
                                   HttpServletRequest servletRequest) {
        AuthService.AuthResult result = authService.login(request.email(), request.password(),
                servletRequest.getHeader("User-Agent"), servletRequest.getRemoteAddr());
        return authenticatedResponse(result);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@CookieValue(name = REFRESH_COOKIE, required = false) String token,
                                     HttpServletRequest request) {
        AuthService.AuthResult result = authService.refresh(token, request.getHeader("User-Agent"),
                request.getRemoteAddr());
        return authenticatedResponse(result);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@CookieValue(name = REFRESH_COOKIE, required = false) String token) {
        authService.logout(token);
        return ResponseEntity.noContent().header(HttpHeaders.SET_COOKIE, clearRefreshCookie().toString())
                .header(HttpHeaders.CACHE_CONTROL, "no-store").build();
    }

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal Jwt jwt) {
        return jdbc.query("""
                SELECT name, email_normalized
                FROM vozly.users
                WHERE id = ? AND status = 'ACTIVE'
                """, rs -> {
            if (!rs.next()) throw new org.springframework.web.server.ResponseStatusException(
                    org.springframework.http.HttpStatus.UNAUTHORIZED);
            return Map.of("userId", jwt.getSubject(),
                    "tenantId", jwt.getClaimAsString("tenant_id"),
                    "role", jwt.getClaimAsString("role"),
                    "name", rs.getString("name"),
                    "email", rs.getString("email_normalized"));
        }, java.util.UUID.fromString(jwt.getSubject()));
    }

    private ResponseEntity<?> authenticatedResponse(AuthService.AuthResult result) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_COOKIE, result.refreshToken())
                .httpOnly(true).secure(secureCookie).sameSite("Strict")
                .path("/api/v1/auth").maxAge(Duration.ofDays(30)).build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .header(HttpHeaders.CACHE_CONTROL, "no-store")
                .header(HttpHeaders.PRAGMA, "no-cache")
                .body(new TokenResponse(result.accessToken(), "Bearer", result.expiresIn(),
                        result.userId(), result.tenantId(), result.role()));
    }

    private ResponseCookie clearRefreshCookie() {
        return ResponseCookie.from(REFRESH_COOKIE, "").httpOnly(true).secure(secureCookie)
                .sameSite("Strict").path("/api/v1/auth").maxAge(Duration.ZERO).build();
    }

    public record RegisterRequest(@NotBlank @Size(max = 120) String name,
                                  @NotBlank @Email @Size(max = 320) String email,
                                  @NotBlank @Size(min = 12, max = 128) String password,
                                  @NotBlank @Size(max = 160) String workspaceName) {}
    public record LoginRequest(@NotBlank @Email @Size(max = 320) String email,
                               @NotBlank @Size(max = 128) String password) {}
    public record TokenResponse(String accessToken, String tokenType, long expiresIn,
                                java.util.UUID userId, java.util.UUID tenantId, String role) {}
}
