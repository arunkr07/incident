ALTER TABLE incidents
ADD COLUMN incident_key VARCHAR(100);

UPDATE incidents
SET incident_key = CONCAT('INC-', id)
WHERE incident_key IS NULL
   OR incident_key = '';

ALTER TABLE incidents
MODIFY COLUMN incident_key VARCHAR(100) NOT NULL;

ALTER TABLE incidents
ADD CONSTRAINT uk_incidents_incident_key
UNIQUE (incident_key);