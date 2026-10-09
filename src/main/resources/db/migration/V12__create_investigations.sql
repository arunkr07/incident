CREATE TABLE investigations (
    id BIGINT NOT NULL AUTO_INCREMENT,
    incident_id BIGINT NOT NULL,

    status VARCHAR(30) NOT NULL,

    root_cause TEXT,
    confidence DOUBLE,
    evidence TEXT,
    recommendation TEXT,
    follow_up_questions TEXT,

    model VARCHAR(100),

    started_at DATETIME,
    completed_at DATETIME,

    error_message TEXT,

    PRIMARY KEY (id),

    CONSTRAINT fk_investigation_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(id)
        ON DELETE CASCADE
);

CREATE INDEX idx_investigations_incident
    ON investigations(incident_id);

CREATE INDEX idx_investigations_status
    ON investigations(status);