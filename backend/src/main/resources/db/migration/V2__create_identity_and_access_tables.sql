CREATE TABLE vozly.users (
    id UUID PRIMARY KEY,
    name VARCHAR(120) NOT NULL,
    email_normalized VARCHAR(320) NOT NULL UNIQUE,
    password_hash VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_users_status CHECK (status IN ('ACTIVE', 'DISABLED'))
);

CREATE TABLE vozly.tenants (
    id UUID PRIMARY KEY,
    name VARCHAR(160) NOT NULL,
    slug VARCHAR(180) NOT NULL UNIQUE,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_tenants_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'ARCHIVED'))
);

CREATE TABLE vozly.memberships (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES vozly.tenants(id),
    user_id UUID NOT NULL REFERENCES vozly.users(id),
    role VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_memberships_tenant_user UNIQUE (tenant_id, user_id),
    CONSTRAINT chk_memberships_role CHECK (role IN ('OWNER', 'ADMIN', 'OPERATOR')),
    CONSTRAINT chk_memberships_status CHECK (status IN ('ACTIVE', 'SUSPENDED', 'REMOVED'))
);

CREATE INDEX idx_memberships_user_status ON vozly.memberships(user_id, status);
CREATE INDEX idx_memberships_tenant_status ON vozly.memberships(tenant_id, status);

CREATE TABLE vozly.external_identities (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES vozly.users(id),
    provider VARCHAR(30) NOT NULL,
    issuer VARCHAR(500) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    email_at_provider VARCHAR(320),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_external_identity_issuer_subject UNIQUE (issuer, subject),
    CONSTRAINT uq_external_identity_user_provider UNIQUE (user_id, provider),
    CONSTRAINT chk_external_identity_provider CHECK (provider IN ('MICROSOFT'))
);

CREATE TABLE vozly.refresh_token_sessions (
    id UUID PRIMARY KEY,
    family_id UUID NOT NULL,
    user_id UUID NOT NULL REFERENCES vozly.users(id),
    token_hash CHAR(64) NOT NULL UNIQUE,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked_at TIMESTAMPTZ,
    replaced_by UUID,
    user_agent VARCHAR(500),
    ip_address VARCHAR(64)
);

CREATE INDEX idx_refresh_sessions_family ON vozly.refresh_token_sessions(family_id);
CREATE INDEX idx_refresh_sessions_user_active ON vozly.refresh_token_sessions(user_id, expires_at)
    WHERE revoked_at IS NULL;
