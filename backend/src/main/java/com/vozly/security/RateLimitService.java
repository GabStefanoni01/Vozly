package com.vozly.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.time.Instant;
import java.util.HexFormat;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class RateLimitService {
    private final JdbcTemplate jdbc;
    private final AtomicInteger cleanupCounter = new AtomicInteger();

    public RateLimitService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public boolean allow(String scope, String clientAddress, int maximumRequests, long windowSeconds) {
        if (maximumRequests < 1 || windowSeconds < 1) {
            throw new IllegalArgumentException("Rate limit configuration must be positive.");
        }

        String bucketKey = hash(scope + "|" + (clientAddress == null ? "unknown" : clientAddress));
        Instant now = Instant.now();
        Timestamp cutoff = Timestamp.from(now.minusSeconds(windowSeconds));
        Timestamp timestamp = Timestamp.from(now);

        int updated = jdbc.update("""
                UPDATE vozly.api_rate_limits
                SET request_count = CASE WHEN window_started_at <= ? THEN 1 ELSE request_count + 1 END,
                    window_started_at = CASE WHEN window_started_at <= ? THEN ? ELSE window_started_at END,
                    updated_at = ?
                WHERE bucket_key = ?
                """, cutoff, cutoff, timestamp, timestamp, bucketKey);

        if (updated == 0) {
            try {
                jdbc.update("""
                        INSERT INTO vozly.api_rate_limits
                            (bucket_key, window_started_at, request_count, updated_at)
                        VALUES (?, ?, 1, ?)
                        """, bucketKey, timestamp, timestamp);
                cleanupExpiredBuckets();
                return true;
            } catch (DuplicateKeyException concurrentInsert) {
                // Another application instance created this bucket concurrently; retry atomically.
                jdbc.update("""
                        UPDATE vozly.api_rate_limits
                        SET request_count = CASE WHEN window_started_at <= ? THEN 1 ELSE request_count + 1 END,
                            window_started_at = CASE WHEN window_started_at <= ? THEN ? ELSE window_started_at END,
                            updated_at = ?
                        WHERE bucket_key = ?
                        """, cutoff, cutoff, timestamp, timestamp, bucketKey);
            }
        }

        Integer requestCount = jdbc.queryForObject(
                "SELECT request_count FROM vozly.api_rate_limits WHERE bucket_key = ?",
                Integer.class, bucketKey);
        cleanupExpiredBuckets();
        return requestCount != null && requestCount <= maximumRequests;
    }

    private void cleanupExpiredBuckets() {
        if (cleanupCounter.incrementAndGet() % 256 == 0) {
            jdbc.update("DELETE FROM vozly.api_rate_limits WHERE updated_at < ?",
                    Timestamp.from(Instant.now().minusSeconds(86_400)));
        }
    }

    private static String hash(String value) {
        try {
            return HexFormat.of().formatHex(
                    MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }
}
