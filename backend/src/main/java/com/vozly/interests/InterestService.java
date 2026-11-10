package com.vozly.interests;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class InterestService {
    private final JdbcTemplate jdbc;

    public InterestService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    @Transactional
    public UUID register(String company, String segment, String email) {
        UUID id = UUID.randomUUID();
        jdbc.update("""
                INSERT INTO vozly.interest_submissions (id, company, segment, email)
                VALUES (?, ?, ?, ?)
                """, id, company.trim(), segment, email.trim().toLowerCase(java.util.Locale.ROOT));
        return id;
    }
}
