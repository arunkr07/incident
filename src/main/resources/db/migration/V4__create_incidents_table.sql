CREATE TABLE incidents (
    id BIGINT NOT NULL AUTO_INCREMENT,

    title VARCHAR(255) NOT NULL,
    description TEXT,

    severity VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL,

    source VARCHAR(50) NOT NULL,

    service_id BIGINT NOT NULL,

    started_at TIMESTAMP NOT NULL,
    acknowledged_at TIMESTAMP NULL,
    resolved_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_incidents_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE RESTRICT,

    INDEX idx_incidents_service (service_id),
    INDEX idx_incidents_status (status),
    INDEX idx_incidents_severity (severity),
    INDEX idx_incidents_started_at (started_at)
);