CREATE TABLE manager_settings (
    id BIGINT NOT NULL AUTO_INCREMENT,
    manager_id BIGINT NOT NULL,
    settings_json LONGTEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT uk_manager_settings_manager UNIQUE (manager_id),
    CONSTRAINT fk_manager_settings_manager
        FOREIGN KEY (manager_id) REFERENCES managers(id) ON DELETE CASCADE
);
