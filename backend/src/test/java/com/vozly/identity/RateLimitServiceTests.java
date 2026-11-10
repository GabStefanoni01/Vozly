package com.vozly.identity;

import org.junit.jupiter.api.Test;
import org.springframework.jdbc.core.JdbcTemplate;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class RateLimitServiceTests {
    @Test
    void allowsRequestsWithinConfiguredWindow() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        when(jdbc.queryForObject(anyString(), eq(Integer.class), any(), any(), any())).thenReturn(3);
        RateLimitService service = new RateLimitService(jdbc);

        assertTrue(service.allow("login", "127.0.0.1", 10, 900));
    }

    @Test
    void rejectsRequestsAboveConfiguredLimit() {
        JdbcTemplate jdbc = mock(JdbcTemplate.class);
        when(jdbc.queryForObject(anyString(), eq(Integer.class), any(), any(), any())).thenReturn(11);
        RateLimitService service = new RateLimitService(jdbc);

        assertFalse(service.allow("login", "127.0.0.1", 10, 900));
    }
}
