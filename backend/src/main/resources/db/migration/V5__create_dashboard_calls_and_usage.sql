-- V5: estrutura inicial para a Visão Geral, chamadas e métricas operacionais.
-- Recursos são tenant-scoped; tenant_id participa das FKs compostas para impedir vínculos cruzados.

CREATE TABLE vozly.agents (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES vozly.tenants(id),
    name VARCHAR(160) NOT NULL,
    description VARCHAR(2000),
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    draft_revision INTEGER NOT NULL DEFAULT 1,
    current_published_version_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_agents_tenant_id UNIQUE (tenant_id, id),
    CONSTRAINT chk_agents_status CHECK (status IN ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED')),
    CONSTRAINT chk_agents_draft_revision CHECK (draft_revision > 0)
);
CREATE INDEX idx_agents_tenant_status_updated ON vozly.agents(tenant_id, status, updated_at DESC);

CREATE TABLE vozly.agent_versions (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL,
    agent_id UUID NOT NULL,
    version_number INTEGER NOT NULL,
    configuration_snapshot JSONB NOT NULL,
    checksum VARCHAR(128) NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    published_by UUID REFERENCES vozly.users(id),
    CONSTRAINT uq_agent_versions_tenant_id UNIQUE (tenant_id, id),
    CONSTRAINT uq_agent_versions_number UNIQUE (tenant_id, agent_id, version_number),
    CONSTRAINT fk_agent_versions_agent FOREIGN KEY (tenant_id, agent_id)
        REFERENCES vozly.agents(tenant_id, id),
    CONSTRAINT chk_agent_versions_number CHECK (version_number > 0)
);
ALTER TABLE vozly.agents
    ADD CONSTRAINT fk_agents_published_version
    FOREIGN KEY (tenant_id, current_published_version_id)
    REFERENCES vozly.agent_versions(tenant_id, id);

CREATE TABLE vozly.phone_numbers (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES vozly.tenants(id),
    provider_key VARCHAR(80) NOT NULL,
    provider_number_ref VARCHAR(255) NOT NULL,
    e164 VARCHAR(16) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    agent_id UUID,
    routing_config JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_phone_numbers_tenant_id UNIQUE (tenant_id, id),
    CONSTRAINT uq_phone_numbers_provider_ref UNIQUE (provider_key, provider_number_ref),
    CONSTRAINT fk_phone_numbers_agent FOREIGN KEY (tenant_id, agent_id)
        REFERENCES vozly.agents(tenant_id, id),
    CONSTRAINT chk_phone_numbers_status CHECK (status IN ('PENDING', 'ACTIVE', 'SUSPENDED', 'RELEASED')),
    CONSTRAINT chk_phone_numbers_e164 CHECK (e164 ~ '^\+[1-9][0-9]{1,14}$')
);
CREATE INDEX idx_phone_numbers_tenant_status ON vozly.phone_numbers(tenant_id, status);

CREATE TABLE vozly.calls (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES vozly.tenants(id),
    agent_id UUID NOT NULL,
    agent_version_id UUID NOT NULL,
    phone_number_id UUID NOT NULL,
    provider_key VARCHAR(80) NOT NULL,
    provider_call_ref VARCHAR(255) NOT NULL,
    direction VARCHAR(12) NOT NULL,
    status VARCHAR(20) NOT NULL,
    end_reason VARCHAR(32),
    caller_number VARCHAR(32),
    started_at TIMESTAMPTZ NOT NULL,
    answered_at TIMESTAMPTZ,
    ended_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_calls_provider_ref UNIQUE (provider_key, provider_call_ref),
    CONSTRAINT fk_calls_agent FOREIGN KEY (tenant_id, agent_id)
        REFERENCES vozly.agents(tenant_id, id),
    CONSTRAINT fk_calls_agent_version FOREIGN KEY (tenant_id, agent_version_id)
        REFERENCES vozly.agent_versions(tenant_id, id),
    CONSTRAINT fk_calls_phone_number FOREIGN KEY (tenant_id, phone_number_id)
        REFERENCES vozly.phone_numbers(tenant_id, id),
    CONSTRAINT chk_calls_direction CHECK (direction IN ('INBOUND', 'OUTBOUND')),
    CONSTRAINT chk_calls_status CHECK (status IN ('RECEIVED', 'RESOLVING', 'RINGING', 'ACTIVE', 'TRANSFERRING', 'COMPLETED', 'FAILED', 'REJECTED', 'CANCELLED', 'TIMED_OUT')),
    CONSTRAINT chk_calls_end_reason CHECK (end_reason IS NULL OR end_reason IN ('RESOLVED', 'TRANSFERRED', 'CALLBACK_REQUESTED', 'CALLER_HANGUP', 'FALLBACK', 'FAILED')),
    CONSTRAINT chk_calls_time_order CHECK (ended_at IS NULL OR ended_at >= started_at),
    CONSTRAINT chk_calls_answer_time CHECK (answered_at IS NULL OR answered_at >= started_at)
);
CREATE INDEX idx_calls_tenant_started ON vozly.calls(tenant_id, started_at DESC);
CREATE INDEX idx_calls_tenant_status_started ON vozly.calls(tenant_id, status, started_at DESC);

CREATE TABLE vozly.usage_records (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES vozly.tenants(id),
    call_id UUID,
    metric VARCHAR(80) NOT NULL,
    quantity NUMERIC(18,6) NOT NULL,
    unit VARCHAR(32) NOT NULL,
    provider_key VARCHAR(80),
    source_event_key VARCHAR(255) NOT NULL,
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_usage_records_call FOREIGN KEY (tenant_id, call_id)
        REFERENCES vozly.calls(tenant_id, id),
    CONSTRAINT uq_usage_records_source UNIQUE (tenant_id, source_event_key, metric),
    CONSTRAINT chk_usage_records_quantity CHECK (quantity >= 0)
);
CREATE INDEX idx_usage_records_tenant_time_metric ON vozly.usage_records(tenant_id, occurred_at, metric);

CREATE TABLE vozly.onboarding_progress (
    id UUID PRIMARY KEY,
    tenant_id UUID NOT NULL UNIQUE REFERENCES vozly.tenants(id),
    current_step VARCHAR(32) NOT NULL DEFAULT 'WORKSPACE',
    completed_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    status VARCHAR(20) NOT NULL DEFAULT 'IN_PROGRESS',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_onboarding_status CHECK (status IN ('IN_PROGRESS', 'COMPLETED'))
);
