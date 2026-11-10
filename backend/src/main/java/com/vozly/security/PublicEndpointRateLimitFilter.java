package com.vozly.security;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class PublicEndpointRateLimitFilter extends OncePerRequestFilter {
    private final RateLimitService rateLimitService;
    private final int loginLimit;
    private final long loginWindow;
    private final int registrationLimit;
    private final long registrationWindow;
    private final int interestLimit;
    private final long interestWindow;
    private final int refreshLimit;
    private final long refreshWindow;

    public PublicEndpointRateLimitFilter(
            RateLimitService rateLimitService,
            @Value("${vozly.security.rate-limit.login.max-attempts:10}") int loginLimit,
            @Value("${vozly.security.rate-limit.login.window-seconds:900}") long loginWindow,
            @Value("${vozly.security.rate-limit.registration.max-attempts:5}") int registrationLimit,
            @Value("${vozly.security.rate-limit.registration.window-seconds:3600}") long registrationWindow,
            @Value("${vozly.security.rate-limit.interest.max-attempts:5}") int interestLimit,
            @Value("${vozly.security.rate-limit.interest.window-seconds:3600}") long interestWindow,
            @Value("${vozly.security.rate-limit.refresh.max-attempts:30}") int refreshLimit,
            @Value("${vozly.security.rate-limit.refresh.window-seconds:900}") long refreshWindow) {
        this.rateLimitService = rateLimitService;
        this.loginLimit = loginLimit;
        this.loginWindow = loginWindow;
        this.registrationLimit = registrationLimit;
        this.registrationWindow = registrationWindow;
        this.interestLimit = interestLimit;
        this.interestWindow = interestWindow;
        this.refreshLimit = refreshLimit;
        this.refreshWindow = refreshWindow;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        if (!"POST".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String path = request.getRequestURI();
        int limit;
        long window;
        String scope;
        if ("/api/v1/auth/login".equals(path)) {
            scope = "login";
            limit = loginLimit;
            window = loginWindow;
        } else if ("/api/v1/auth/register".equals(path)) {
            scope = "registration";
            limit = registrationLimit;
            window = registrationWindow;
        } else if ("/api/v1/interests".equals(path)) {
            scope = "interest";
            limit = interestLimit;
            window = interestWindow;
        } else if ("/api/v1/auth/refresh".equals(path)) {
            scope = "refresh";
            limit = refreshLimit;
            window = refreshWindow;
        } else {
            filterChain.doFilter(request, response);
            return;
        }

        if (!rateLimitService.allow(scope, request.getRemoteAddr(), limit, window)) {
            response.setStatus(429);
            response.setHeader("Retry-After", Long.toString(window));
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.getWriter().write("{\"error\":\"too_many_requests\",\"message\":\"Muitas tentativas. Aguarde antes de tentar novamente.\"}");
            return;
        }

        filterChain.doFilter(request, response);
    }
}
