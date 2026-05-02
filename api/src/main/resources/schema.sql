CREATE TABLE teams
(
    id   VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE phases
(
    id            VARCHAR(255) PRIMARY KEY,
    name          VARCHAR(255) NOT NULL,
    display_order INTEGER      NOT NULL,
    type          VARCHAR(255) NOT NULL
);

CREATE TABLE games
(
    id          VARCHAR(255) PRIMARY KEY,
    phase_id    VARCHAR(255) NOT NULL,
    name        VARCHAR(255),
    group_id    VARCHAR(255) NOT NULL,
    time        TIMESTAMP    NOT NULL,
    court       VARCHAR(255) NOT NULL,
    is_finished BOOLEAN      NOT NULL,
    score_data  TEXT,
    referee_id  VARCHAR(255),
    FOREIGN KEY (phase_id) REFERENCES phases (id),
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
