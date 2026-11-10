package com.vozly.identity;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {
    private static final String UPSERT = """
            INSERT INTO vozly.rate_limit_buckets AS bucket (bucket_key, window_started_at, request_count)
            VALUES (?, CURRENT_TIMESTAMP, 1)
            ON CONFLICT (bucket_key) DO UPDATE SET
                request_count = CASE
                    WHEN bucket.window_started_at <= CURRENT_TIMESTAMP - (? * INTERVAL '1 second') THEN 1
                    ELSE bucket.request_count + 1
                END,
                window_started_at = CASE
                    WHEN bucket.window_started_at <= CURRENT_TIMESTAMP - (? * INTERVAL '1 second') THEN CURRENT_TIMESTAMP
                    ELSE vozly.rate_limit_buckets.window_started_at
                END
            RETURNING request_count
            """;

    private final JdbcTemplate jdbc;
    private final AtomicLong cleanupCounter = new AtomicLong();

    public RateLimitService(JdbcTemplate jdbc) { this.jdbc = jdbc; }

    public boolean allow(String route, String remoteAddress, int limit, int windowSeconds) {
        if (limit < 1 || windowSeconds < 1) throw new IllegalArgumentException("Rate limit values must be positive.");
        String address = remoteAddress == null ? "unknown" : remoteAddress;
        String key = digest(route + ":" + address);
        Integer count = jdbc.queryForObject(UPSERT, Integer.class, key, windowSeconds, windowSeconds);
        if (cleanupCounter.incrementAndGet() % 100 == 0) {
            jdbc.update("DELETE FROM vozly.rate_limit_buckets WHERE window_started_at < CURRENT_TIMESTAMP - INTERVAL '2 days'");
        }
        return count != null && count <= limit;
    }

    private static String digest(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception exception) {
            throw new IllegalStateException("Não foi possível calcular a chave de limitação.", exception);
        }
    }
}
