package com.vozly.identity;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

@Component
public class ActiveMembershipFilter extends OncePerRequestFilter {
    private final JdbcTemplate jdbc;

    public ActiveMembershipFilter(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication instanceof JwtAuthenticationToken jwtAuthentication) {
            try {
                UUID userId = UUID.fromString(jwtAuthentication.getToken().getSubject());
                UUID tenantId = UUID.fromString(jwtAuthentication.getToken().getClaimAsString("tenant_id"));
                String tokenRole = jwtAuthentication.getToken().getClaimAsString("role");
                List<String> roles = jdbc.query("""
                        SELECT m.role
                        FROM vozly.memberships m
                        JOIN vozly.users u ON u.id = m.user_id
                        JOIN vozly.tenants t ON t.id = m.tenant_id
                        WHERE m.user_id = ? AND m.tenant_id = ?
                          AND m.status = 'ACTIVE' AND u.status = 'ACTIVE' AND t.status = 'ACTIVE'
                        """, (rs, rowNum) -> rs.getString("role"), userId, tenantId);
                if (roles.isEmpty() || !roles.getFirst().equals(tokenRole)) {
                    response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } catch (IllegalArgumentException exception) {
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }
        filterChain.doFilter(request, response);
    }
}
