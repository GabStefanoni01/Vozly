package com.vozly.identity;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class PasswordResetService {
    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final int TOKEN_VALIDITY_MINUTES = 30;
    private final JdbcTemplate jdbc;
    private final PasswordEncoder passwordEncoder;
    private final JavaMailSender mailSender;
    private final String frontendUrl;
    private final String fromAddress;

    public PasswordResetService(JdbcTemplate jdbc, PasswordEncoder passwordEncoder,
            JavaMailSender mailSender,
            @Value("${vozly.security.frontend-url}") String frontendUrl,
            @Value("${vozly.security.password-reset.from:nao-responda@vozly.com}") String fromAddress) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl.replaceAll("/+$", "");
        this.fromAddress = fromAddress;
    }

    @Transactional
    public void requestReset(String email) {
        String normalizedEmail = email.trim().toLowerCase(java.util.Locale.ROOT);
        List<UUID> users = jdbc.query("""
                SELECT id FROM vozly.users
                WHERE email_normalized = ? AND status = 'ACTIVE'
                """, (rs, rowNum) -> rs.getObject("id", UUID.class), normalizedEmail);
        if (users.isEmpty()) return;

        UUID userId = users.getFirst();
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String rawToken = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        jdbc.update("""
                UPDATE vozly.password_reset_tokens
                SET used_at = CURRENT_TIMESTAMP
                WHERE user_id = ? AND used_at IS NULL
                """, userId);
        jdbc.update("""
                INSERT INTO vozly.password_reset_tokens (id, user_id, token_hash, expires_at)
                VALUES (?, ?, ?, ?)
                """, UUID.randomUUID(), userId, sha256(rawToken),
                java.sql.Timestamp.from(Instant.now().plus(TOKEN_VALIDITY_MINUTES, ChronoUnit.MINUTES)));

        String resetUrl = frontendUrl + "/reset-password?token="
                + java.net.URLEncoder.encode(rawToken, StandardCharsets.UTF_8);
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(normalizedEmail);
        message.setSubject("Redefinição de senha — Vozly");
        message.setText("""
                Recebemos uma solicitação para redefinir a senha da sua conta Vozly.

                Para criar uma nova senha, acesse o link abaixo:
                %s

                O link expira em 30 minutos e só pode ser utilizado uma vez.
                Se você não solicitou a redefinição, ignore este e-mail.

                Vozly
                """.formatted(resetUrl));
        try {
            mailSender.send(message);
        } catch (MailException exception) {
            // Keep the response identical for existing and unknown addresses.
            log.error("Password reset email delivery failed. Check SMTP configuration.", exception);
        }
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword) {
        if (rawToken == null || rawToken.isBlank()) throw invalidToken();
        List<ResetToken> matches = jdbc.query("""
                SELECT id, user_id
                FROM vozly.password_reset_tokens
                WHERE token_hash = ? AND used_at IS NULL
                  AND expires_at > CURRENT_TIMESTAMP
                FOR UPDATE
                """, (rs, rowNum) -> new ResetToken(
                    rs.getObject("id", UUID.class), rs.getObject("user_id", UUID.class)),
                sha256(rawToken));
        if (matches.isEmpty()) throw invalidToken();

        ResetToken token = matches.getFirst();
        int consumed = jdbc.update("""
                UPDATE vozly.password_reset_tokens
                SET used_at = CURRENT_TIMESTAMP
                WHERE id = ? AND used_at IS NULL
                """, token.id());
        if (consumed != 1) throw invalidToken();

        int changed = jdbc.update("""
                UPDATE vozly.users
                SET password_hash = ?, updated_at = CURRENT_TIMESTAMP
                WHERE id = ? AND status = 'ACTIVE'
                """, passwordEncoder.encode(newPassword), token.userId());
        if (changed != 1) throw invalidToken();

        jdbc.update("""
                UPDATE vozly.refresh_token_sessions
                SET revoked_at = COALESCE(revoked_at, CURRENT_TIMESTAMP)
                WHERE user_id = ?
                """, token.userId());
        jdbc.update("""
                UPDATE vozly.password_reset_tokens
                SET used_at = CURRENT_TIMESTAMP
                WHERE user_id = ? AND id <> ? AND used_at IS NULL
                """, token.userId(), token.id());
    }

    private static ResponseStatusException invalidToken() {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST,
                "Link de redefinição inválido ou expirado. Solicite um novo link.");
    }

    private static String sha256(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256")
                    .digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível processar o token.", exception);
        }
    }

    private record ResetToken(UUID id, UUID userId) {}
}
