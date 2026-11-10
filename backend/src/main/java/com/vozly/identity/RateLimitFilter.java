package com.vozly.identity;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private final RateLimitService rateLimitService;
    private final int loginMax, loginWindow, registrationMax, registrationWindow;
    private final int refreshMax, refreshWindow, interestMax, interestWindow;

    public RateLimitFilter(RateLimitService rateLimitService,
            @Value("${vozly.security.rate-limit.login.max-attempts:10}") int loginMax,
            @Value("${vozly.security.rate-limit.login.window-seconds:900}") int loginWindow,
            @Value("${vozly.security.rate-limit.registration.max-attempts:5}") int registrationMax,
            @Value("${vozly.security.rate-limit.registration.window-seconds:3600}") int registrationWindow,
            @Value("${vozly.security.rate-limit.refresh.max-attempts:30}") int refreshMax,
            @Value("${vozly.security.rate-limit.refresh.window-seconds:900}") int refreshWindow,
            @Value("${vozly.security.rate-limit.interest.max-attempts:5}") int interestMax,
            @Value("${vozly.security.rate-limit.interest.window-seconds:3600}") int interestWindow) {
        this.rateLimitService = rateLimitService;
        this.loginMax = loginMax;
        this.loginWindow = loginWindow;
        this.registrationMax = registrationMax;
        this.registrationWindow = registrationWindow;
        this.refreshMax = refreshMax;
        this.refreshWindow = refreshWindow;
        this.interestMax = interestMax;
        this.interestWindow = interestWindow;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Limit limit = resolve(request);
        if (limit == null) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            if (!rateLimitService.allow(limit.route(), request.getRemoteAddr(),
                    limit.maxRequests(), limit.windowSeconds())) {
                response.setStatus(429);
                response.setHeader("Retry-After", Integer.toString(limit.windowSeconds()));
                response.setHeader("Cache-Control", "no-store");
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.getWriter().write("{\"error\":\"rate_limit_exceeded\",\"message\":\"Muitas tentativas. Tente novamente mais tarde.\"}");
                return;
            }
        } catch (DataAccessException exception) {
            response.setStatus(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
            response.setHeader("Cache-Control", "no-store");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"error\":\"temporarily_unavailable\",\"message\":\"Serviço temporariamente indisponível.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }

    private Limit resolve(HttpServletRequest request) {
        if (!"POST".equalsIgnoreCase(request.getMethod())) return null;
        return switch (request.getRequestURI()) {
            case "/api/v1/auth/login" -> new Limit("login", loginMax, loginWindow);
            case "/api/v1/auth/register" -> new Limit("register", registrationMax, registrationWindow);
            case "/api/v1/auth/refresh" -> new Limit("refresh", refreshMax, refreshWindow);
            case "/api/v1/interests" -> new Limit("interest", interestMax, interestWindow);
            default -> null;
        };
    }

    private record Limit(String route, int maxRequests, int windowSeconds) {}
}
