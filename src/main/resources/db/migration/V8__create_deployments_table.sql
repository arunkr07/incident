CREATE TABLE deployments (
    id BIGINT NOT NULL AUTO_INCREMENT,

    service_id BIGINT NOT NULL,

    version VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL,

    description VARCHAR(1000),

    started_at TIMESTAMP NOT NULL,
    completed_at TIMESTAMP NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_deployments_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE CASCADE,

    INDEX idx_deployments_service (service_id),
    INDEX idx_deployments_status (status),
    INDEX idx_deployments_started_at (started_at)
);