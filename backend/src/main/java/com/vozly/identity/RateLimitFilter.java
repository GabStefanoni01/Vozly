package com.vozly.identity;

import java.io.IOException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.dao.DataAccessException;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private final RateLimitService rateLimitService;

    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
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
            case "/api/v1/auth/login" -> new Limit("login", 10, 900);
            case "/api/v1/auth/register" -> new Limit("register", 5, 3600);
            case "/api/v1/auth/refresh" -> new Limit("refresh", 30, 300);
            case "/api/v1/interests" -> new Limit("interest", 5, 3600);
            default -> null;
        };
    }

    private record Limit(String route, int maxRequests, int windowSeconds) {}
}
