CREATE TABLE vozly.interest_submissions (
    id UUID PRIMARY KEY,
    company TEXT NOT NULL,
    segment VARCHAR(30) NOT NULL,
    email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_interest_segment CHECK (
        segment IN ('assistencia', 'clinica', 'oficina', 'manutencao', 'servicos', 'outros')
    )
);

CREATE INDEX idx_interest_submissions_created_at
    ON vozly.interest_submissions (created_at DESC);
