CREATE TABLE IF NOT EXISTS application_metadata (
    id BIGINT NOT NULL AUTO_INCREMENT,
    application_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY (id)
);

INSERT INTO application_metadata (
    application_name
)
VALUES (
    'incident-backend'
);