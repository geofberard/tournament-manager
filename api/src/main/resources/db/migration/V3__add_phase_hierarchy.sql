ALTER TABLE phases
    ADD COLUMN parent_id VARCHAR(255);

ALTER TABLE phases
    ADD CONSTRAINT fk_phases_parent
        FOREIGN KEY (parent_id) REFERENCES phases (id);

CREATE INDEX idx_phases_parent_id ON phases (parent_id);
