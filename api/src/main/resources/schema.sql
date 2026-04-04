CREATE TABLE teams
(
    id   VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE games
(
    id          VARCHAR(255) PRIMARY KEY,
    time        TIMESTAMP    NOT NULL,
    court       VARCHAR(255) NOT NULL,
    is_finished BOOLEAN      NOT NULL,
    score_data  TEXT,
    referee_id  VARCHAR(255),
    FOREIGN KEY (referee_id) REFERENCES teams (id) ON DELETE SET NULL
);

CREATE TABLE game_teams
(
    game_id VARCHAR(255),
    team_id VARCHAR(255),
    PRIMARY KEY (game_id, team_id),
    FOREIGN KEY (game_id) REFERENCES games (id) ON DELETE CASCADE,
    FOREIGN KEY (team_id) REFERENCES teams (id) ON DELETE CASCADE
);
