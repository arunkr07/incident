CREATE TABLE post_incident_reports (
    id BIGINT NOT NULL AUTO_INCREMENT,
    incident_id BIGINT NOT NULL,
    summary TEXT NOT NULL,
    timeline_json LONGTEXT NOT NULL,
    probable_root_cause TEXT NOT NULL,
    evidence_json LONGTEXT NOT NULL,
    impact TEXT NOT NULL,
    corrective_actions_json LONGTEXT NOT NULL,
    preventive_actions_json LONGTEXT NOT NULL,
    model VARCHAR(100) NULL,
    generated_at DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_post_incident_report_incident UNIQUE (incident_id),
    CONSTRAINT fk_post_incident_report_incident
        FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);
