INSERT INTO teams (id, name)
VALUES ('team_1', 'Star Wars Heroes'),
       ('team_2', 'Back to the Future Crew'),
       ('team_3', 'Friends'),
       ('team_4', 'The A-Team'),
       ('team_5', 'Teenage Mutant Ninja Turtles'),
       ('team_6', 'Mousquetaires'),
       ('team_7', 'Harry Potter'),
       ('team_8', 'Jurassic Park Team');

INSERT INTO phases (id, name, details, display_order, type)
VALUES ('phase_1', 'Poules de brassage', '# Poules de brassage

Cette premiere phase permet de repartir les equipes selon leurs premiers resultats.

Chaque equipe dispute ses matchs de poule afin d''etablir un classement initial.', 1, 'POOL'),
       ('phase_2', 'Poules principales', '# Poules principales

Les equipes sont redistribuees dans de nouvelles poules en fonction de la phase precedente.

Les resultats de cette phase determinent l''acces au tableau final.', 2, 'POOL'),
       ('phase_3', 'Bracket final', '# Bracket final

Le tableau final rassemble les equipes qualifiees pour les matchs a elimination directe.

## Matchs joues

- demi-finales
- petite finale
- finale

Consultez le **tableau final** pour suivre l''avancement des rencontres.', 3, 'BRACKET');

INSERT INTO games (id, phase_id, subgroup, group_id, time, court, is_finished, score_data)
VALUES ('game_1', 'phase_1', NULL, 'Poule A', '2022-11-01 11:00:00', 'Terrain1', TRUE, '23-18'),
       ('game_2', 'phase_1', NULL, 'Poule A', '2022-11-01 11:00:00', 'Terrain2', TRUE, '20-21'),
       ('game_3', 'phase_1', NULL, 'Poule B', '2022-11-01 11:00:00', 'Terrain3', TRUE, '19-23'),
       ('game_4', 'phase_1', NULL, 'Poule B', '2022-11-01 11:00:00', 'Terrain4', TRUE, '21-13'),
       ('game_5', 'phase_1', NULL, 'Poule A', '2022-11-01 11:20:00', 'Terrain1', TRUE, '13-4'),
       ('game_6', 'phase_1', NULL, 'Poule A', '2022-11-01 11:20:00', 'Terrain2', TRUE, '19-8'),
       ('game_7', 'phase_1', NULL, 'Poule B', '2022-11-01 11:20:00', 'Terrain3', TRUE, '13-13'),
       ('game_8', 'phase_1', NULL, 'Poule B', '2022-11-01 11:20:00', 'Terrain4', TRUE, '19-3'),
       ('game_9', 'phase_2', NULL, 'Poule A', '2022-11-01 11:40:00', 'Terrain1', FALSE, '21-10'),
       ('game_10', 'phase_2', NULL, 'Poule B', '2022-11-01 11:40:00', 'Terrain2', FALSE, '18-24'),
       ('game_11', 'phase_2', NULL, 'Poule A', '2022-11-01 12:00:00', 'Terrain3', FALSE, '12-9'),
       ('game_12', 'phase_2', NULL, 'Poule B', '2022-11-01 12:00:00', 'Terrain4', FALSE, '16-14'),
       ('game_13', 'phase_3', '1/2', 'Principale', '2022-11-01 12:20:00', 'Terrain1', FALSE, NULL),
       ('game_14', 'phase_3', '1/2', 'Principale', '2022-11-01 12:20:00', 'Terrain2', FALSE, NULL),
       ('game_15', 'phase_3', 'Finales', 'Consolante', '2022-11-01 12:40:00', 'Terrain1', FALSE, NULL),
       ('game_16', 'phase_3', 'Finales', 'Principale', '2022-11-01 12:40:00', 'Terrain2', FALSE, NULL);

INSERT INTO game_teams (game_id, team_id)
VALUES ('game_1', 'team_1'),
       ('game_1', 'team_2'),
       ('game_2', 'team_3'),
       ('game_2', 'team_4'),
       ('game_3', 'team_5'),
       ('game_3', 'team_6'),
       ('game_4', 'team_7'),
       ('game_4', 'team_8'),
       ('game_5', 'team_1'),
       ('game_5', 'team_3'),
       ('game_6', 'team_2'),
       ('game_6', 'team_4'),
       ('game_7', 'team_5'),
       ('game_7', 'team_7'),
       ('game_8', 'team_6'),
       ('game_8', 'team_8'),
       ('game_9', 'team_1'),
       ('game_9', 'team_4'),
       ('game_10', 'team_5'),
       ('game_10', 'team_8'),
       ('game_11', 'team_2'),
       ('game_11', 'team_3'),
       ('game_12', 'team_6'),
       ('game_12', 'team_7'),
       ('game_13', 'team_1'),
       ('game_13', 'team_8'),
       ('game_14', 'team_4'),
       ('game_14', 'team_5'),
       ('game_15', 'team_1'),
       ('game_15', 'team_4'),
       ('game_16', 'team_8'),
       ('game_16', 'team_5');
