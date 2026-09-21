CREATE TABLE incident_timeline (
    id BIGINT NOT NULL AUTO_INCREMENT,

    incident_id BIGINT NOT NULL,

    event_type VARCHAR(50) NOT NULL,
    message VARCHAR(1000) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_timeline_incident
        FOREIGN KEY (incident_id)
        REFERENCES incidents(id)
        ON DELETE CASCADE,

    INDEX idx_timeline_incident (incident_id),
    INDEX idx_timeline_created_at (created_at)
);