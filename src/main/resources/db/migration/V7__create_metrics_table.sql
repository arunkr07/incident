CREATE TABLE metrics (
    id BIGINT NOT NULL AUTO_INCREMENT,

    service_id BIGINT NOT NULL,

    metric_type VARCHAR(50) NOT NULL,
    metric_value DOUBLE NOT NULL,

    recorded_at TIMESTAMP NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_metrics_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE CASCADE,

    INDEX idx_metrics_service (service_id),
    INDEX idx_metrics_type (metric_type),
    INDEX idx_metrics_recorded_at (recorded_at)
);