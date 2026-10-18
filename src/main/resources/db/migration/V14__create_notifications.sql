CREATE TABLE notifications (
    id BIGINT NOT NULL AUTO_INCREMENT,
    event_id VARCHAR(100) NULL,
    type VARCHAR(30) NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    incident_id BIGINT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_notifications_event_id UNIQUE (event_id),
    CONSTRAINT fk_notifications_incident
        FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE SET NULL,
    INDEX idx_notifications_created_at (created_at),
    INDEX idx_notifications_read_created (is_read, created_at)
);
