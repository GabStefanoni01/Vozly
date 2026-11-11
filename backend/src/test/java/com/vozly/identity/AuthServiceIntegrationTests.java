package com.vozly.identity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class AuthServiceIntegrationTests {
    @Autowired AuthService authService;
    @Autowired AuthController authController;
    @Autowired JdbcTemplate jdbc;
    @Autowired org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @BeforeEach
    void prepareSchema() {
        jdbc.execute("CREATE SCHEMA IF NOT EXISTS vozly");
        jdbc.execute("DROP TABLE IF EXISTS vozly.refresh_token_sessions");
        jdbc.execute("DROP TABLE IF EXISTS vozly.external_identities");
        jdbc.execute("DROP TABLE IF EXISTS vozly.memberships");
        jdbc.execute("DROP TABLE IF EXISTS vozly.tenants");
        jdbc.execute("DROP TABLE IF EXISTS vozly.users");
        jdbc.execute("""
                CREATE TABLE vozly.users (
                    id UUID PRIMARY KEY, name VARCHAR(120) NOT NULL,
                    email_normalized VARCHAR(320) NOT NULL UNIQUE,
                    password_hash VARCHAR(100), status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
                """);
        jdbc.execute("""
                CREATE TABLE vozly.tenants (
                    id UUID PRIMARY KEY, name VARCHAR(160) NOT NULL,
                    slug VARCHAR(180) NOT NULL UNIQUE, status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP)
                """);
        jdbc.execute("""
                CREATE TABLE vozly.memberships (
                    id UUID PRIMARY KEY, tenant_id UUID NOT NULL REFERENCES vozly.tenants(id),
                    user_id UUID NOT NULL REFERENCES vozly.users(id), role VARCHAR(20) NOT NULL,
                    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT uq_memberships_tenant_user UNIQUE (tenant_id, user_id),
                    CONSTRAINT uq_memberships_single_workspace_per_user UNIQUE (user_id))
                """);
        jdbc.execute("""
                CREATE TABLE vozly.external_identities (
                    id UUID PRIMARY KEY, user_id UUID NOT NULL REFERENCES vozly.users(id),
                    provider VARCHAR(30) NOT NULL, issuer VARCHAR(500) NOT NULL,
                    subject VARCHAR(255) NOT NULL, email_at_provider VARCHAR(320),
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    CONSTRAINT uq_external_identity_issuer_subject UNIQUE (issuer, subject),
                    CONSTRAINT uq_external_identity_user_provider UNIQUE (user_id, provider))
                """);
        jdbc.execute("""
                CREATE TABLE vozly.refresh_token_sessions (
                    id UUID PRIMARY KEY, family_id UUID NOT NULL,
                    user_id UUID NOT NULL REFERENCES vozly.users(id),
                    token_hash CHAR(64) NOT NULL UNIQUE, expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                    revoked_at TIMESTAMP WITH TIME ZONE, replaced_by UUID,
                    user_agent VARCHAR(500), ip_address VARCHAR(64))
                """);
    }

    @Test
    void registrationCreatesOwnerWorkspaceAndLoginIssuesTokens() {
        AuthService.AuthResult registered = authService.register(
                "Gabriel", "GABRIEL@EXAMPLE.COM", "a-very-strong-password",
                "Vozly Workspace", "test-agent", "127.0.0.1");

        assertThat(registered.accessToken()).isNotBlank();
        assertThat(registered.refreshToken()).isNotBlank();
        assertThat(registered.role()).isEqualTo("OWNER");
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM vozly.users", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM vozly.tenants", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT role FROM vozly.memberships", String.class)).isEqualTo("OWNER");
        String storedPassword = jdbc.queryForObject(
                "SELECT password_hash FROM vozly.users WHERE id = ?",
                String.class, registered.userId());
        assertThat(storedPassword).isNotEqualTo("a-very-strong-password");
        assertThat(passwordEncoder.matches("a-very-strong-password", storedPassword)).isTrue();

        AuthService.AuthResult login = authService.login(
                "gabriel@example.com", "a-very-strong-password", "test-agent", "127.0.0.1");
        assertThat(login.accessToken()).isNotBlank();
        assertThat(login.userId()).isEqualTo(registered.userId());
    }

    @Test
    void registrationRejectsDuplicateEmailRegardlessOfCaseOrWhitespace() {
        authService.register("Gabriel", "Gabriel@Example.com", "a-very-strong-password",
                "Vozly Workspace", null, null);

        assertThatThrownBy(() -> authService.register(
                "Another Name", "  gabriel@example.com  ", "another-strong-password",
                "Another Workspace", null, null))
                .isInstanceOf(AuthService.EmailAlreadyRegisteredException.class);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM vozly.users", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM vozly.tenants", Integer.class)).isEqualTo(1);
    }

    @Test
    void authenticatedIdentityReturnsDatabaseProfileAndJwtTenantContext() {
        AuthService.AuthResult registered = authService.register(
                "Gabriel Stefanoni", "gabriel@example.com", "a-very-strong-password",
                "Vozly Workspace", null, null);
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "HS256")
                .subject(registered.userId().toString())
                .claim("tenant_id", registered.tenantId().toString())
                .claim("role", registered.role())
                .build();

        var identity = authController.me(jwt);

        assertThat(identity)
                .containsEntry("userId", registered.userId().toString())
                .containsEntry("tenantId", registered.tenantId().toString())
                .containsEntry("role", "OWNER")
                .containsEntry("name", "Gabriel Stefanoni")
                .containsEntry("email", "gabriel@example.com");
    }

    @Test
    void authenticatedIdentityRejectsDisabledUser() {
        AuthService.AuthResult registered = authService.register(
                "Gabriel", "gabriel@example.com", "a-very-strong-password",
                "Vozly Workspace", null, null);
        jdbc.update("UPDATE vozly.users SET status = 'DISABLED' WHERE id = ?", registered.userId());
        Jwt jwt = Jwt.withTokenValue("test-token")
                .header("alg", "HS256")
                .subject(registered.userId().toString())
                .claim("tenant_id", registered.tenantId().toString())
                .claim("role", registered.role())
                .build();

        assertThatThrownBy(() -> authController.me(jwt))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void databasePreventsAUserFromJoiningASecondWorkspace() {
        AuthService.AuthResult registered = authService.register(
                "Gabriel", "gabriel@example.com", "a-very-strong-password",
                "Vozly Workspace", null, null);
        java.util.UUID secondTenantId = java.util.UUID.randomUUID();
        jdbc.update("INSERT INTO vozly.tenants (id, name, slug) VALUES (?, ?, ?)",
                secondTenantId, "Second Workspace", "second-workspace");

        assertThatThrownBy(() -> jdbc.update("""
                INSERT INTO vozly.memberships (id, tenant_id, user_id, role)
                VALUES (?, ?, ?, 'OWNER')
                """, java.util.UUID.randomUUID(), secondTenantId, registered.userId()))
                .isInstanceOf(org.springframework.dao.DataIntegrityViolationException.class);
    }

    @Test
    void refreshRotatesTokenAndLogoutRevokesIt() {
        AuthService.AuthResult registered = authService.register(
                "Gabriel", "gabriel@example.com", "a-very-strong-password",
                "Vozly Workspace", null, null);

        AuthService.AuthResult rotated = authService.refresh(
                registered.refreshToken(), null, null);
        assertThat(rotated.refreshToken()).isNotEqualTo(registered.refreshToken());

        authService.logout(rotated.refreshToken());
        assertThatThrownBy(() -> authService.refresh(rotated.refreshToken(), null, null))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void reuseOfRotatedRefreshTokenRevokesItsTokenFamily() {
        AuthService.AuthResult registered = authService.register(
                "Gabriel", "gabriel@example.com", "a-very-strong-password",
                "Vozly Workspace", null, null);
        AuthService.AuthResult rotated = authService.refresh(registered.refreshToken(), null, null);

        assertThatThrownBy(() -> authService.refresh(registered.refreshToken(), null, null))
                .isInstanceOf(BadCredentialsException.class);
        assertThatThrownBy(() -> authService.refresh(rotated.refreshToken(), null, null))
                .isInstanceOf(BadCredentialsException.class);
    }

    @Test
    void microsoftIdentityCreatesWorkspaceAndReusesStableIssuerSubjectLink() {
        String tenant = "8f5d4a6e-19c2-4d4b-a021-0b2d5f71a111";
        String issuer = "https://login.microsoftonline.com/" + tenant + "/v2.0";
        AuthService.AuthResult first = authService.loginMicrosoft(
                issuer, "microsoft-subject-123", "person@company.example", "Person",
                "test-agent", "127.0.0.1");
        AuthService.AuthResult second = authService.loginMicrosoft(
                issuer, "microsoft-subject-123", "different-claim@company.example", "Person",
                "test-agent", "127.0.0.1");

        assertThat(first.userId()).isEqualTo(second.userId());
        assertThat(first.role()).isEqualTo("OWNER");
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM vozly.users", Integer.class)).isEqualTo(1);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM vozly.external_identities", Integer.class)).isEqualTo(1);
    }

    @Test
    void microsoftDoesNotSilentlyLinkToExistingLocalEmail() {
        authService.register("Person", "person@company.example", "a-very-strong-password",
                "Company", null, null);

        assertThatThrownBy(() -> authService.loginMicrosoft(
                "https://login.microsoftonline.com/8f5d4a6e-19c2-4d4b-a021-0b2d5f71a111/v2.0",
                "microsoft-subject-456", "person@company.example", "Person", null, null))
                .isInstanceOf(AuthService.AccountLinkRequiredException.class);
        assertThat(jdbc.queryForObject("SELECT COUNT(*) FROM vozly.users", Integer.class)).isEqualTo(1);
    }

    @Test
    void invalidPasswordIsRejected() {
        authService.register("Gabriel", "gabriel@example.com", "a-very-strong-password",
                "Vozly Workspace", null, null);

        assertThatThrownBy(() -> authService.login(
                "gabriel@example.com", "wrong-password", null, null))
                .isInstanceOf(BadCredentialsException.class);
    }
}
