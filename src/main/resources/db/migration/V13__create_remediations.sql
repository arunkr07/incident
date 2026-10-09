CREATE TABLE remediations (
    id BIGINT NOT NULL AUTO_INCREMENT,

    incident_id BIGINT NOT NULL,
    service_id BIGINT NOT NULL,

    type VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL,

    reason TEXT,
    risk TEXT,
    parameters TEXT,

    created_at DATETIME,
    approved_at DATETIME,
    executed_at DATETIME,
    completed_at DATETIME,

    execution_message TEXT,
    failure_reason TEXT,

    PRIMARY KEY (id),

    CONSTRAINT fk_remediation_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_remediation_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
);

CREATE INDEX idx_remediation_incident
    ON remediations(incident_id);

CREATE INDEX idx_remediation_status
    ON remediations(status);