CREATE TABLE audit_record (
    id         BIGSERIAL PRIMARY KEY,
    request_id VARCHAR(32) NOT NULL,
    action     VARCHAR(64) NOT NULL,
    actor      VARCHAR(64) NOT NULL,
    at         TIMESTAMP NOT NULL
);

CREATE INDEX idx_audit_request ON audit_record (request_id);
