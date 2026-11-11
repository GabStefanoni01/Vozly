package com.vozly.dashboard;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.security.oauth2.jwt.Jwt;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers(disabledWithoutDocker = true)
class DashboardControllerPostgresTests {
    @Container
    private static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine");
    private static JdbcTemplate jdbc;
    private static DashboardController controller;

    @BeforeAll
    static void migrateDatabase() {
        Flyway.configure()
                .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
                .locations("classpath:db/migration")
                .schemas("vozly")
                .defaultSchema("vozly")
                .createSchemas(true)
                .validateOnMigrate(true)
                .load()
                .migrate();
        DriverManagerDataSource dataSource = new DriverManagerDataSource(
                POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
        jdbc = new JdbcTemplate(dataSource);
        controller = new DashboardController(jdbc);
    }

    @BeforeEach
    void clearDomainRows() {
        jdbc.update("DELETE FROM vozly.calls");
        jdbc.update("DELETE FROM vozly.phone_numbers");
        jdbc.update("UPDATE vozly.agents SET current_published_version_id = NULL");
        jdbc.update("DELETE FROM vozly.agents");
        jdbc.update("DELETE FROM vozly.agent_versions");
        jdbc.update("DELETE FROM vozly.memberships");
        jdbc.update("DELETE FROM vozly.tenants");
    }

    @Test
    void usageSummaryAggregatesCallsAndFillsDaysWithoutCalls() {
        Seed seed = seedTenantWithCall("5511999994321",
                OffsetDateTime.parse("2026-11-10T10:00:00Z"),
                OffsetDateTime.parse("2026-11-10T10:01:10Z"), "RESOLVED");

        DashboardController.UsageSummaryResponse summary = controller.usageSummary(
                jwt(seed.tenantId()), OffsetDateTime.parse("2026-11-09T00:00:00Z"),
                OffsetDateTime.parse("2026-11-12T00:00:00Z"), "DAY");

        assertThat(summary.calls().total()).isEqualTo(1);
        assertThat(summary.calls().completed()).isEqualTo(1);
        assertThat(summary.calls().transferred()).isZero();
        assertThat(summary.calls().failed()).isZero();
        assertThat(summary.previousCalls().total()).isZero();
        assertThat(summary.durationSeconds().total()).isEqualTo(70);
        assertThat(summary.durationSeconds().average()).isEqualTo(70.0);
        assertThat(summary.series()).hasSize(3);
        assertThat(summary.series()).extracting(DashboardController.DailyUsage::calls)
                .containsExactly(0L, 1L, 0L);
        assertThat(summary.endReasons()).containsExactly(
                new DashboardController.EndReasonCount("RESOLVED", 1L));
    }

    @Test
    void callListIsTenantScopedAndMasksCallerNumber() {
        Seed first = seedTenantWithCall("5511999994321",
                OffsetDateTime.parse("2026-11-10T10:00:00Z"),
                OffsetDateTime.parse("2026-11-10T10:01:10Z"), "RESOLVED");
        seedTenantWithCall("5511888887654",
                OffsetDateTime.parse("2026-11-10T11:00:00Z"),
                OffsetDateTime.parse("2026-11-10T11:01:10Z"), "RESOLVED");

        DashboardController.PageResponse<DashboardController.CallListItem> page =
                controller.calls(jwt(first.tenantId()), 0, 10, "startedAt,desc");

        assertThat(page.pagination().totalElements()).isEqualTo(1);
        assertThat(page.data()).hasSize(1);
        assertThat(page.data().getFirst().callerNumberMasked()).isEqualTo("••••••4321");
        assertThat(page.data().getFirst().phoneNumber()).isEqualTo("+5511999990000");
    }

    private Seed seedTenantWithCall(String caller, OffsetDateTime started,
                                    OffsetDateTime ended, String endReason) {
        UUID tenantId = UUID.randomUUID();
        UUID userId = UUID.randomUUID();
        UUID agentId = UUID.randomUUID();
        UUID versionId = UUID.randomUUID();
        UUID phoneId = UUID.randomUUID();
        UUID callId = UUID.randomUUID();
        String suffix = tenantId.toString().substring(0, 8);

        jdbc.update("INSERT INTO vozly.users(id,name,email_normalized) VALUES (?, ?, ?)",
                userId, "Test user", suffix + "@example.test");
        jdbc.update("INSERT INTO vozly.tenants(id,name,slug) VALUES (?, ?, ?)",
                tenantId, "Tenant " + suffix, "tenant-" + suffix);
        jdbc.update("INSERT INTO vozly.memberships(id,tenant_id,user_id,role) VALUES (?, ?, ?, 'OWNER')",
                UUID.randomUUID(), tenantId, userId);
        jdbc.update("""
                INSERT INTO vozly.agents(id,tenant_id,name,status,draft_revision)
                VALUES (?, ?, 'Support agent', 'ACTIVE', 1)
                """, agentId, tenantId);
        jdbc.update("""
                INSERT INTO vozly.agent_versions
                    (id,tenant_id,agent_id,version_number,configuration_snapshot,checksum,published_at)
                VALUES (?, ?, ?, 1, '{}'::jsonb, 'checksum', ?)
                """, versionId, tenantId, agentId, started);
        jdbc.update("UPDATE vozly.agents SET current_published_version_id = ? WHERE tenant_id = ? AND id = ?",
                versionId, tenantId, agentId);
        jdbc.update("""
                INSERT INTO vozly.phone_numbers
                    (id,tenant_id,provider_key,provider_number_ref,e164,status,agent_id)
                VALUES (?, ?, 'test-provider', ?, '+5511999990000', 'ACTIVE', ?)
                """, phoneId, tenantId, "number-" + suffix, agentId);
        jdbc.update("""
                INSERT INTO vozly.calls
                    (id,tenant_id,agent_id,agent_version_id,phone_number_id,provider_key,
                     provider_call_ref,direction,status,end_reason,caller_number,started_at,answered_at,ended_at)
                VALUES (?, ?, ?, ?, ?, 'test-provider', ?, 'INBOUND', 'COMPLETED', ?, ?, ?, ?, ?)
                """, callId, tenantId, agentId, versionId, phoneId, "call-" + suffix,
                endReason, caller, started, started.plusSeconds(10), ended);
        return new Seed(tenantId);
    }

    private static Jwt jwt(UUID tenantId) {
        return Jwt.withTokenValue("test-token")
                .header("alg", "none")
                .subject(UUID.randomUUID().toString())
                .claim("tenant_id", tenantId.toString())
                .claim("role", "OWNER")
                .build();
    }

    private record Seed(UUID tenantId) {}
}
