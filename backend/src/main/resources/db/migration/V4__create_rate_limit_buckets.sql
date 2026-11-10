CREATE TABLE IF NOT EXISTS vozly.rate_limit_buckets (
    bucket_key VARCHAR(64) PRIMARY KEY,
    window_started_at TIMESTAMPTZ NOT NULL,
    request_count INTEGER NOT NULL CHECK (request_count > 0)
);
CREATE INDEX IF NOT EXISTS idx_rate_limit_buckets_window
    ON vozly.rate_limit_buckets (window_started_at);
