CREATE TABLE logs (
    id BIGINT NOT NULL AUTO_INCREMENT,

    service_id BIGINT NOT NULL,

    level VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,

    timestamp TIMESTAMP NOT NULL,

    trace_id VARCHAR(100),
    request_id VARCHAR(100),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_logs_service
        FOREIGN KEY (service_id)
        REFERENCES services(id)
        ON DELETE CASCADE,

    INDEX idx_logs_service (service_id),
    INDEX idx_logs_level (level),
    INDEX idx_logs_timestamp (timestamp),
    INDEX idx_logs_trace_id (trace_id)
);