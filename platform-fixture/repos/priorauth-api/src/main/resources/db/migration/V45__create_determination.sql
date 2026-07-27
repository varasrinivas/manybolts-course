CREATE TABLE determination (
    request_id           VARCHAR(32) PRIMARY KEY,
    status               VARCHAR(24) NOT NULL,
    confidence           NUMERIC(4,3) NOT NULL,
    criteria_set_version VARCHAR(16) NOT NULL,
    decided_at           TIMESTAMP NOT NULL,
    decision_deadline    DATE NOT NULL
);
