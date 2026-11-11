package com.vozly.db;

import static org.assertj.core.api.Assertions.assertThat;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashSet;
import java.util.Set;

import org.flywaydb.core.Flyway;
import org.junit.jupiter.api.Test;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@Testcontainers(disabledWithoutDocker = true)
class FlywayPostgresMigrationTests {
    @Container
    private static final PostgreSQLContainer<?> POSTGRES =
            new PostgreSQLContainer<>("postgres:16-alpine");

    @Test
    void appliesAndValidatesAllMigrationsOnAnEmptyPostgresDatabase() throws Exception {
        Flyway flyway = Flyway.configure()
                .dataSource(POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword())
                .locations("classpath:db/migration")
                .schemas("vozly")
                .defaultSchema("vozly")
                .createSchemas(true)
                .validateOnMigrate(true)
                .cleanDisabled(true)
                .load();

        var migrationResult = flyway.migrate();

        assertThat(migrationResult.migrationsExecuted).isEqualTo(4);
        flyway.validate();

        Set<String> tables = new HashSet<>();
        try (Connection connection = DriverManager.getConnection(
                    POSTGRES.getJdbcUrl(), POSTGRES.getUsername(), POSTGRES.getPassword());
             Statement statement = connection.createStatement();
             ResultSet result = statement.executeQuery("""
                     SELECT table_name
                     FROM information_schema.tables
                     WHERE table_schema = 'vozly'
                     """)) {
            while (result.next()) tables.add(result.getString(1));
        }

        assertThat(tables).contains(
                "users",
                "tenants",
                "memberships",
                "external_identities",
                "refresh_token_sessions",
                "interest_submissions",
                "rate_limit_buckets",
                "flyway_schema_history");

        assertThat(flyway.migrate().migrationsExecuted).isZero();
    }
}