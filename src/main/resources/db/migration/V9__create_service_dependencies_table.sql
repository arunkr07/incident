CREATE TABLE service_dependencies (
    id BIGINT NOT NULL AUTO_INCREMENT,

    source_service_id BIGINT NOT NULL,
    target_service_id BIGINT NOT NULL,

    dependency_type VARCHAR(50) NOT NULL DEFAULT 'SYNCHRONOUS',

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id),

    CONSTRAINT fk_dependency_source
        FOREIGN KEY (source_service_id)
        REFERENCES services(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_dependency_target
        FOREIGN KEY (target_service_id)
        REFERENCES services(id)
        ON DELETE CASCADE,

    CONSTRAINT uk_service_dependency
        UNIQUE (source_service_id, target_service_id),

    CONSTRAINT chk_no_self_dependency
        CHECK (source_service_id <> target_service_id),

    INDEX idx_dependency_source (source_service_id),
    INDEX idx_dependency_target (target_service_id)
);