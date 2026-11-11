CREATE TABLE vozly.password_reset_tokens (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES vozly.users(id) ON DELETE CASCADE,
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_password_reset_tokens_user_created ON vozly.password_reset_tokens(user_id, created_at DESC);
CREATE INDEX idx_password_reset_tokens_expiration ON vozly.password_reset_tokens(expires_at);
