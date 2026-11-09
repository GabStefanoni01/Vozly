package com.vozly.identity;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final long ACCESS_TOKEN_MINUTES = 10;
    private static final long REFRESH_TOKEN_DAYS = 30;

    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwordEncoder;
    private final JwtEncoder jwtEncoder;
    private final RefreshSessionRevocationService revocationService;
    private final String issuer;
    private final String audience;

    public AuthService(
            JdbcTemplate jdbc,
            PasswordEncoder passwordEncoder,
            JwtEncoder jwtEncoder,
            RefreshSessionRevocationService revocationService,
            @Value("${vozly.security.jwt.issuer}") String issuer,
            @Value("${vozly.security.jwt.audience}") String audience) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
        this.jwtEncoder = jwtEncoder;
        this.revocationService = revocationService;
        this.issuer = issuer;
        this.audience = audience;
    }

    @Transactional
    public AuthResult register(String name, String email, String password, String workspaceName,
                               String userAgent, String ipAddress) {
        String normalizedEmail = normalizeEmail(email);
        if (jdbc.queryForObject("SELECT COUNT(*) FROM vozly.users WHERE email_normalized = ?",
                Integer.class, normalizedEmail) > 0) {
            throw new EmailAlreadyRegisteredException();
        }

        UUID userId = UUID.randomUUID();
        UUID tenantId = UUID.randomUUID();
        String slug = slugify(workspaceName) + "-" + tenantId.toString().substring(0, 8);

        jdbc.update("""
                INSERT INTO vozly.users (id, name, email_normalized, password_hash)
                VALUES (?, ?, ?, ?)
                """, userId, name.trim(), normalizedEmail, passwordEncoder.encode(password));
        jdbc.update("""
                INSERT INTO vozly.tenants (id, name, slug) VALUES (?, ?, ?)
                """, tenantId, workspaceName.trim(), slug);
        jdbc.update("""
                INSERT INTO vozly.memberships (id, tenant_id, user_id, role)
                VALUES (?, ?, ?, 'OWNER')
                """, UUID.randomUUID(), tenantId, userId);

        return issueSession(userId, tenantId, "OWNER", userAgent, ipAddress);
    }

    @Transactional
    public AuthResult login(String email, String password, String userAgent, String ipAddress) {
        String normalizedEmail = normalizeEmail(email);
        List<UserMembership> matches = jdbc.query("""
                SELECT u.id AS user_id, u.password_hash, u.status AS user_status,
                       m.tenant_id, m.role
                FROM vozly.users u
                JOIN vozly.memberships m ON m.user_id = u.id
                JOIN vozly.tenants t ON t.id = m.tenant_id
                WHERE u.email_normalized = ? AND m.status = 'ACTIVE' AND t.status = 'ACTIVE'
                ORDER BY m.created_at
                LIMIT 1
                """, (rs, rowNum) -> new UserMembership(
                    rs.getObject("user_id", UUID.class),
                    rs.getString("password_hash"),
                    rs.getString("user_status"),
                    rs.getObject("tenant_id", UUID.class),
                    rs.getString("role")), normalizedEmail);

        if (matches.isEmpty()) throw new BadCredentialsException("Credenciais inválidas.");
        UserMembership user = matches.getFirst();
        if (!"ACTIVE".equals(user.userStatus()) || user.passwordHash() == null
                || !passwordEncoder.matches(password, user.passwordHash())) {
            throw new BadCredentialsException("Credenciais inválidas.");
        }
        return issueSession(user.userId(), user.tenantId(), user.role(), userAgent, ipAddress);
    }

    @Transactional
    public AuthResult loginMicrosoft(String issuer, String subject, String email, String displayName,
                                     String userAgent, String ipAddress) {
        if (issuer == null || subject == null || email == null || !email.contains("@")) {
            throw new BadCredentialsException("A conta Microsoft não forneceu uma identidade utilizável.");
        }
        List<UUID> linkedUsers = jdbc.query("""
                SELECT user_id FROM vozly.external_identities
                WHERE issuer = ? AND subject = ?
                """, (rs, rowNum) -> rs.getObject("user_id", UUID.class), issuer, subject);

        UUID userId;
        if (!linkedUsers.isEmpty()) {
            userId = linkedUsers.getFirst();
        } else {
            String normalizedEmail = normalizeEmail(email);
            Integer existing = jdbc.queryForObject(
                    "SELECT COUNT(*) FROM vozly.users WHERE email_normalized = ?",
                    Integer.class, normalizedEmail);
            if (existing != null && existing > 0) {
                throw new AccountLinkRequiredException();
            }

            userId = UUID.randomUUID();
            UUID tenantId = UUID.randomUUID();
            String safeName = displayName == null || displayName.isBlank()
                    ? normalizedEmail.substring(0, normalizedEmail.indexOf('@')) : displayName.trim();
            String workspaceName = safeName + " workspace";
            jdbc.update("""
                    INSERT INTO vozly.users (id, name, email_normalized, password_hash)
                    VALUES (?, ?, ?, NULL)
                    """, userId, safeName.substring(0, Math.min(safeName.length(), 120)), normalizedEmail);
            jdbc.update("INSERT INTO vozly.tenants (id, name, slug) VALUES (?, ?, ?)",
                    tenantId, workspaceName, slugify(workspaceName) + "-" + tenantId.toString().substring(0, 8));
            jdbc.update("""
                    INSERT INTO vozly.memberships (id, tenant_id, user_id, role)
                    VALUES (?, ?, ?, 'OWNER')
                    """, UUID.randomUUID(), tenantId, userId);
            jdbc.update("""
                    INSERT INTO vozly.external_identities
                        (id, user_id, provider, issuer, subject, email_at_provider)
                    VALUES (?, ?, 'MICROSOFT', ?, ?, ?)
                    """, UUID.randomUUID(), userId, issuer, subject, normalizedEmail);
        }

        List<UserMembership> memberships = jdbc.query("""
                SELECT u.id AS user_id, u.password_hash, u.status AS user_status,
                       m.tenant_id, m.role
                FROM vozly.users u
                JOIN vozly.memberships m ON m.user_id = u.id
                JOIN vozly.tenants t ON t.id = m.tenant_id
                WHERE u.id = ? AND u.status = 'ACTIVE'
                  AND m.status = 'ACTIVE' AND t.status = 'ACTIVE'
                ORDER BY m.created_at LIMIT 1
                """, (rs, rowNum) -> new UserMembership(
                    rs.getObject("user_id", UUID.class), rs.getString("password_hash"),
                    rs.getString("user_status"), rs.getObject("tenant_id", UUID.class),
                    rs.getString("role")), userId);
        if (memberships.isEmpty()) throw new BadCredentialsException("Conta indisponível.");
        UserMembership membership = memberships.getFirst();
        return issueSession(userId, membership.tenantId(), membership.role(), userAgent, ipAddress);
    }

    @Transactional
    public AuthResult refresh(String rawToken, String userAgent, String ipAddress) {
        if (rawToken == null || rawToken.isBlank()) throw new BadCredentialsException("Sessão inválida.");
        String tokenHash = sha256(rawToken);
        List<RefreshSession> rows = jdbc.query("""
                SELECT id, family_id, user_id, expires_at, revoked_at
                FROM vozly.refresh_token_sessions
                WHERE token_hash = ?
                FOR UPDATE
                """, (rs, rowNum) -> new RefreshSession(
                    rs.getObject("id", UUID.class),
                    rs.getObject("family_id", UUID.class),
                    rs.getObject("user_id", UUID.class),
                    rs.getTimestamp("expires_at").toInstant(),
                    rs.getTimestamp("revoked_at") == null ? null : rs.getTimestamp("revoked_at").toInstant()
                ), tokenHash);

        if (rows.isEmpty()) throw new BadCredentialsException("Sessão inválida.");
        RefreshSession session = rows.getFirst();
        if (session.revokedAt() != null) {
            jdbc.update("UPDATE vozly.refresh_token_sessions SET revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP) WHERE family_id = ?",
                    session.familyId());
            throw new BadCredentialsException("Sessão inválida.");
        }
        if (session.expiresAt().isBefore(Instant.now())) {
            jdbc.update("UPDATE vozly.refresh_token_sessions SET revoked_at = CURRENT_TIMESTAMP WHERE id = ?", session.id());
            throw new BadCredentialsException("Sessão expirada.");
        }

        List<UserMembership> memberships = jdbc.query("""
                SELECT u.id AS user_id, u.password_hash, u.status AS user_status,
                       m.tenant_id, m.role
                FROM vozly.users u
                JOIN vozly.memberships m ON m.user_id = u.id
                JOIN vozly.tenants t ON t.id = m.tenant_id
                WHERE u.id = ? AND u.status = 'ACTIVE'
                  AND m.status = 'ACTIVE' AND t.status = 'ACTIVE'
                ORDER BY m.created_at LIMIT 1
                """, (rs, rowNum) -> new UserMembership(
                    rs.getObject("user_id", UUID.class), rs.getString("password_hash"),
                    rs.getString("user_status"), rs.getObject("tenant_id", UUID.class),
                    rs.getString("role")), session.userId());
        if (memberships.isEmpty()) throw new BadCredentialsException("Sessão inválida.");

        UUID nextId = UUID.randomUUID();
        jdbc.update("UPDATE vozly.refresh_token_sessions SET revoked_at = CURRENT_TIMESTAMP, replaced_by = ? WHERE id = ?",
                nextId, session.id());
        UserMembership membership = memberships.getFirst();
        return issueSession(session.userId(), membership.tenantId(), membership.role(),
                userAgent, ipAddress, session.familyId(), nextId);
    }

    @Transactional
    public void logout(String rawToken) {
        if (rawToken == null || rawToken.isBlank()) return;
        jdbc.update("""
                UPDATE vozly.refresh_token_sessions
                SET revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP)
                WHERE token_hash = ?
                """, sha256(rawToken));
    }

    private AuthResult issueSession(UUID userId, UUID tenantId, String role,
                                    String userAgent, String ipAddress) {
        return issueSession(userId, tenantId, role, userAgent, ipAddress,
                UUID.randomUUID(), UUID.randomUUID());
    }

    private AuthResult issueSession(UUID userId, UUID tenantId, String role,
                                    String userAgent, String ipAddress,
                                    UUID familyId, UUID sessionId) {
        Instant now = Instant.now();
        Instant expiresAt = now.plus(ACCESS_TOKEN_MINUTES, ChronoUnit.MINUTES);
        JwtClaimsSet claims = JwtClaimsSet.builder()
                .issuer(issuer)
                .audience(List.of(audience))
                .subject(userId.toString())
                .issuedAt(now)
                .expiresAt(expiresAt)
                .claim("tenant_id", tenantId.toString())
                .claim("role", role)
                .build();
        String accessToken = jwtEncoder.encode(JwtEncoderParameters.from(
                JwsHeader.with(MacAlgorithm.HS256).build(), claims)).getTokenValue();

        byte[] bytes = new byte[48];
        RANDOM.nextBytes(bytes);
        String refreshToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        jdbc.update("""
                INSERT INTO vozly.refresh_token_sessions
                    (id, family_id, user_id, token_hash, expires_at, user_agent, ip_address)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """, sessionId, familyId, userId, sha256(refreshToken),
                java.sql.Timestamp.from(now.plus(REFRESH_TOKEN_DAYS, ChronoUnit.DAYS)),
                truncate(userAgent, 500), truncate(ipAddress, 64));

        return new AuthResult(accessToken, refreshToken, ACCESS_TOKEN_MINUTES * 60,
                userId, tenantId, role);
    }

    private static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private static String slugify(String value) {
        String slug = value.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return slug.isBlank() ? "workspace" : slug.substring(0, Math.min(slug.length(), 150));
    }

    private static String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível processar o token.", exception);
        }
    }

    private static String truncate(String value, int max) {
        return value == null ? null : value.substring(0, Math.min(value.length(), max));
    }

    private record UserMembership(UUID userId, String passwordHash, String userStatus,
                                  UUID tenantId, String role) {}
    private record RefreshSession(UUID id, UUID familyId, UUID userId, Instant expiresAt,
                                  Instant revokedAt) {}
    public record AuthResult(String accessToken, String refreshToken, long expiresIn,
                             UUID userId, UUID tenantId, String role) {}
    public static class AccountLinkRequiredException extends RuntimeException {
        public AccountLinkRequiredException() { super("Entre pela forma original de acesso para vincular a conta Microsoft."); }
    }
    public static class EmailAlreadyRegisteredException extends RuntimeException {
        public EmailAlreadyRegisteredException() { super("E-mail já cadastrado."); }
    }
}
