package com.vozly.security;

import static org.assertj.core.api.Assertions.assertThat;

import org.h2.jdbcx.JdbcDataSource;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

class RateLimitServiceTest {
    private RateLimitService rateLimitService;

    @BeforeEach
    void setUp() {
        JdbcDataSource dataSource = new JdbcDataSource();
        dataSource.setURL("jdbc:h2:mem:rate_limit;MODE=PostgreSQL;DB_CLOSE_DELAY=-1");
        JdbcTemplate jdbc = new JdbcTemplate(dataSource);
        jdbc.execute("CREATE SCHEMA IF NOT EXISTS vozly");
        jdbc.execute("""
                CREATE TABLE IF NOT EXISTS vozly.api_rate_limits (
                    bucket_key VARCHAR(64) PRIMARY KEY,
                    window_started_at TIMESTAMP WITH TIME ZONE NOT NULL,
                    request_count INTEGER NOT NULL,
                    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
                )
                """);
        jdbc.update("DELETE FROM vozly.api_rate_limits");
        rateLimitService = new RateLimitService(jdbc);
    }

    @Test
    void blocksRequestsAfterConfiguredLimitForSameClientAndScope() {
        assertThat(rateLimitService.allow("login", "192.0.2.10", 2, 900)).isTrue();
        assertThat(rateLimitService.allow("login", "192.0.2.10", 2, 900)).isTrue();
        assertThat(rateLimitService.allow("login", "192.0.2.10", 2, 900)).isFalse();
    }

    @Test
    void keepsSeparateBucketsForDifferentScopesAndClients() {
        assertThat(rateLimitService.allow("login", "192.0.2.10", 1, 900)).isTrue();
        assertThat(rateLimitService.allow("registration", "192.0.2.10", 1, 900)).isTrue();
        assertThat(rateLimitService.allow("login", "192.0.2.11", 1, 900)).isTrue();
    }
}
