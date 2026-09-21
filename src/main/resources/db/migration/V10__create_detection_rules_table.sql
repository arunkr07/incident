CREATE TABLE detection_rules (
    id BIGINT NOT NULL AUTO_INCREMENT,

    service_id BIGINT NOT NULL,

    name VARCHAR(150) NOT NULL,

    metric_type VARCHAR(50) NOT NULL,
    operator VARCHAR(20) NOT NULL,

    threshold DOUBLE NOT NULL,

    severity VARCHAR(30) NOT NULL,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    evaluation_window_seconds INT NOT NULL DEFAULT 60,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_detection_rule_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE CASCADE,

    INDEX idx_detection_rules_service (service_id),
    INDEX idx_detection_rules_enabled (enabled)
);