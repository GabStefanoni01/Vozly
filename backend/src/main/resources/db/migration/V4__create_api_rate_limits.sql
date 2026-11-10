CREATE TABLE vozly.api_rate_limits (
    bucket_key VARCHAR(64) PRIMARY KEY,
    window_started_at TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL CHECK (request_count > 0),
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX idx_api_rate_limits_updated_at
    ON vozly.api_rate_limits (updated_at);
