ALTER TABLE games
    ADD COLUMN status VARCHAR(32);

UPDATE games
SET status = CASE
    WHEN score_data IS NOT NULL THEN 'COMPLETED'
    ELSE 'SCHEDULED'
END;

ALTER TABLE games
    ALTER COLUMN status SET NOT NULL;

ALTER TABLE games
    ADD CONSTRAINT games_status_check CHECK (status IN ('SCHEDULED', 'COMPLETED'));

ALTER TABLE games
    DROP COLUMN is_finished;
