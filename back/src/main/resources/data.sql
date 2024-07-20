-- Insérer des données dans la table players
INSERT INTO players (id, firstname, lastname)
VALUES ('player_1', 'Luke', 'Skywalker'),
       ('player_2', 'Leia', 'Organa'),
       ('player_3', 'Han', 'Solo'),
       ('player_4', 'Chewbacca', ''),
       ('player_5', 'Darth', 'Vader'),
       ('player_6', 'Marty', 'McFly'),
       ('player_7', 'Doc', 'Brown'),
       ('player_8', 'Biff', 'Tannen'),
       ('player_9', 'Jennifer', 'Parker'),
       ('player_10', 'George', 'McFly'),
       ('player_11', 'Rachel', 'Green'),
       ('player_12', 'Monica', 'Geller'),
       ('player_13', 'Phoebe', 'Buffay'),
       ('player_14', 'Joey', 'Tribbiani'),
       ('player_15', 'Chandler', 'Bing'),
       ('player_16', 'Ross', 'Geller'),
       ('player_17', 'Hannibal', 'Smith'),
       ('player_18', 'B.A.', 'Baracus'),
       ('player_19', 'Face', 'Peck'),
       ('player_20', 'Howling Mad', 'Murdock'),
       ('player_21', 'Leonardo', ''),
       ('player_22', 'Michelangelo', ''),
       ('player_23', 'Donatello', ''),
       ('player_24', 'Raphael', ''),
       ('player_25', 'Splinter', ''),
       ('player_26', 'Athos', ''),
       ('player_27', 'Porthos', ''),
       ('player_28', 'Aramis', ''),
       ('player_29', 'D''Artagnan', ''),
       ('player_30', 'Harry', 'Potter'),
       ('player_31', 'Hermione', 'Granger'),
       ('player_32', 'Ron', 'Weasley'),
       ('player_33', 'Albus', 'Dumbledore'),
       ('player_34', 'Severus', 'Snape'),
       ('player_35', 'Alan', 'Grant'),
       ('player_36', 'Ellie', 'Sattler'),
       ('player_37', 'Ian', 'Malcolm'),
       ('player_38', 'John', 'Hammond'),
       ('player_39', 'Robert', 'Muldoon');

-- Insérer des données dans la table team
INSERT INTO teams (id, name)
VALUES ('team_1', 'Star Wars Heroes'),
       ('team_2', 'Back to the Future Crew'),
       ('team_3', 'Friends'),
       ('team_4', 'The A-Team'),
       ('team_5', 'Teenage Mutant Ninja Turtles'),
       ('team_6', 'Mousquetaires'),
       ('team_7', 'Harry Potter'),
       ('team_8', 'Jurassic Park Team');

-- Insérer des données dans la table team_players
INSERT INTO team_players (team_id, player_id)
VALUES ('team_1', 'player_1'),  -- Luke Skywalker in Star Wars Heroes
       ('team_1', 'player_2'),  -- Leia Organa in Star Wars Heroes
       ('team_1', 'player_3'),  -- Han Solo in Star Wars Heroes
       ('team_1', 'player_4'),  -- Chewbacca in Star Wars Heroes
       ('team_1', 'player_5'),  -- Darth Vader in Star Wars Heroes
       ('team_2', 'player_6'),  -- Marty McFly in Back to the Future Crew
       ('team_2', 'player_7'),  -- Doc Brown in Back to the Future Crew
       ('team_2', 'player_8'),  -- Biff Tannen in Back to the Future Crew
       ('team_2', 'player_9'),  -- Jennifer Parker in Back to the Future Crew
       ('team_2', 'player_10'), -- George McFly in Back to the Future Crew
       ('team_3', 'player_11'), -- Rachel Green in Friends
       ('team_3', 'player_12'), -- Monica Geller in Friends
       ('team_3', 'player_13'), -- Phoebe Buffay in Friends
       ('team_3', 'player_14'), -- Joey Tribbiani in Friends
       ('team_3', 'player_15'), -- Chandler Bing in Friends
       ('team_3', 'player_16'), -- Ross Geller in Friends
       ('team_4', 'player_17'), -- Hannibal Smith in The A-Team
       ('team_4', 'player_18'), -- B.A. Baracus in The A-Team
       ('team_4', 'player_19'), -- Face Peck in The A-Team
       ('team_4', 'player_20'), -- Howling Mad Murdock in The A-Team
       ('team_5', 'player_21'), -- Leonardo in Teenage Mutant Ninja Turtles
       ('team_5', 'player_22'), -- Michelangelo in Teenage Mutant Ninja Turtles
       ('team_5', 'player_23'), -- Donatello in Teenage Mutant Ninja Turtles
       ('team_5', 'player_24'), -- Raphael in Teenage Mutant Ninja Turtles
       ('team_5', 'player_25'), -- Splinter in Teenage Mutant Ninja Turtles
       ('team_6', 'player_26'), -- Athos in Mousquetaires
       ('team_6', 'player_27'), -- Porthos in Mousquetaires
       ('team_6', 'player_28'), -- Aramis in Mousquetaires
       ('team_6', 'player_29'), -- D'Artagnan in Mousquetaires
       ('team_7', 'player_30'), -- Harry Potter in Harry Potter
       ('team_7', 'player_31'), -- Hermione Granger in Harry Potter
       ('team_7', 'player_32'), -- Ron Weasley in Harry Potter
       ('team_7', 'player_33'), -- Albus Dumbledore in Harry Potter
       ('team_7', 'player_34'), -- Severus Snape in Harry Potter
       ('team_8', 'player_35'), -- Alan Grant in Jurassic Park Team
       ('team_8', 'player_36'), -- Ellie Sattler in Jurassic Park Team
       ('team_8', 'player_37'), -- Ian Malcolm in Jurassic Park Team
       ('team_8', 'player_38'), -- John Hammond in Jurassic Park Team
       ('team_8', 'player_39'); -- Robert Muldoon in Jurassic Park Team

INSERT INTO games (id, time, court, is_finished, score_type, score_data)
VALUES ('game_1', '2022-11-01 11:00:00', 'Terrain1', TRUE, 'DepthTwo', '23-18;7-2;4-5'),
       ('game_2', '2022-11-01 11:00:00', 'Terrain2', TRUE, 'DepthTwo', '20-21;6-23;20-12'),
       ('game_3', '2022-11-01 11:00:00', 'Terrain3', TRUE, 'DepthTwo', '19-23;3-18;7-4'),
       ('game_4', '2022-11-01 11:20:00', 'Terrain1', TRUE, 'DepthTwo', '21-13;7-22;15-2'),
       ('game_5', '2022-11-01 11:20:00', 'Terrain2', TRUE, 'DepthTwo', '13-4;15-6;9-8'),
       ('game_6', '2022-11-01 11:20:00', 'Terrain3', TRUE, 'DepthTwo', '19-8;8-9;0-9'),
       ('game_7', '2022-11-01 11:40:00', 'Terrain1', TRUE, 'DepthTwo', '13-13;11-1;1-8'),
       ('game_8', '2022-11-01 11:40:00', 'Terrain2', TRUE, 'DepthTwo', '19-3;20-21;19-9'),
       ('game_9', '2022-11-01 11:40:00', 'Terrain3', TRUE, 'DepthTwo', '21-10;8-13;24-4'),
       ('game_10', '2022-11-01 12:00:00', 'Terrain1', TRUE, 'DepthTwo', '18-24;13-17;8-22'),
       ('game_11', '2022-11-01 12:00:00', 'Terrain2', TRUE, 'DepthTwo', '24-24;17-4;2-21'),
       ('game_12', '2022-11-01 12:00:00', 'Terrain3', TRUE, 'DepthTwo', '7-4;10-9;23-24'),
       ('game_13', '2022-11-01 11:40:00', 'Terrain7', TRUE, 'DepthTwo', '4-3;11-17;13-18'),
       ('game_15', '2022-11-01 12:20:00', 'Terrain3', TRUE, 'DepthTwo', '4-14;24-25;2-21'),
       ('game_16', '2022-11-01 12:40:00', 'Terrain1', TRUE, 'DepthTwo', '23-20;16-21;7-11'),
       ('game_17', '2022-11-01 12:40:00', 'Terrain2', TRUE, 'DepthTwo', '3-16;23-16;19-0'),
       ('game_18', '2022-11-01 12:40:00', 'Terrain3', TRUE, 'DepthTwo', '16-4;23-1;18-4'),
       ('game_19', '2022-11-01 13:00:00', 'Terrain1', TRUE, 'DepthTwo', '16-9;8-21;23-10'),
       ('game_20', '2022-11-01 13:00:00', 'Terrain2', TRUE, 'DepthTwo', '5-7;13-2;24-22'),
       ('game_21', '2022-11-01 13:00:00', 'Terrain3', TRUE, 'DepthTwo', '16-1;25-21;2-17'),
       ('game_22', '2022-11-01 14:30:00', 'Terrain1', TRUE, 'DepthTwo', '12-18;3-18;22-14'),
       ('game_23', '2022-11-01 14:30:00', 'Terrain2', TRUE, 'DepthTwo', '3-9;9-17;10-4'),
       ('game_24', '2022-11-01 14:30:00', 'Terrain3', TRUE, 'DepthTwo', '4-7;1-6;23-19'),
       ('game_25', '2022-11-01 14:50:00', 'Terrain1', TRUE, 'DepthTwo', '18-3;9-21;12-23'),
       ('game_26', '2022-11-01 14:50:00', 'Terrain2', TRUE, 'DepthTwo', '16-3;20-21;5-15'),
       ('game_27', '2022-11-01 14:50:00', 'Terrain3', TRUE, 'DepthTwo', '12-22;3-7;6-9'),
       ('game_28', '2022-11-01 15:10:00', 'Terrain1', TRUE, 'DepthTwo', '16-14;10-8;8-21'),
       ('game_29', '2022-11-01 15:10:00', 'Terrain2', TRUE, 'DepthTwo', '6-18;2-15;14-17'),
       ('game_30', '2022-11-01 15:10:00', 'Terrain3', TRUE, 'DepthTwo', '6-8;8-24;25-24'),
       ('game_31', '2022-11-01 15:30:00', 'Terrain1', TRUE, 'DepthTwo', '24-1;9-15;15-13'),
       ('game_32', '2022-11-01 15:30:00', 'Terrain2', TRUE, 'DepthTwo', '8-6;17-22;8-1'),
       ('game_33', '2022-11-01 15:30:00', 'Terrain3', TRUE, 'DepthTwo', '17-24;1-16;23-8'),
       ('game_34', '2022-11-01 15:50:00', 'Terrain1', TRUE, 'DepthTwo', '3-13;17-4;9-1'),
       ('game_35', '2022-11-01 15:50:00', 'Terrain2', TRUE, 'DepthTwo', '24-3;7-14;2-2'),
       ('game_36', '2022-11-01 15:50:00', 'Terrain3', TRUE, 'DepthTwo', '1-24;20-17;0-8'),
       ('game_37', '2022-11-01 16:10:00', 'Terrain1', TRUE, 'DepthTwo', '20-18;24-2;6-24'),
       ('game_38', '2022-11-01 16:10:00', 'Terrain2', TRUE, 'DepthTwo', '9-25;21-11;11-9'),
       ('game_39', '2022-11-01 16:10:00', 'Terrain3', TRUE, 'DepthTwo', '21-24;7-11;6-6'),
       ('game_40', '2022-11-01 16:30:00', 'Terrain1', TRUE, 'DepthTwo', '1-18;4-16;9-21'),
       ('game_41', '2022-11-01 16:30:00', 'Terrain2', TRUE, 'DepthTwo', '0-8;18-24;24-12'),
       ('game_42', '2022-11-01 16:30:00', 'Terrain3', TRUE, 'DepthTwo', '13-14;18-14;24-22');

INSERT INTO game_teams (game_id, team_id)
VALUES ('game_1', 'team_1'),
       ('game_1', 'team_2'),
       ('game_2', 'team_3'),
       ('game_2', 'team_4'),
       ('game_3', 'team_5'),
       ('game_3', 'team_6'),
       ('game_4', 'team_1'),
       ('game_4', 'team_3'),
       ('game_5', 'team_5'),
       ('game_5', 'team_4'),
       ('game_6', 'team_6'),
       ('game_6', 'team_7'),
       ('game_7', 'team_1'),
       ('game_7', 'team_4'),
       ('game_8', 'team_2'),
       ('game_8', 'team_5'),
       ('game_9', 'team_7'),
       ('game_9', 'team_3'),
       ('game_10', 'team_1'),
       ('game_10', 'team_5'),
       ('game_11', 'team_6'),
       ('game_11', 'team_3'),
       ('game_12', 'team_2'),
       ('game_12', 'team_7'),
       ('game_13', 'team_1'),
       ('game_13', 'team_4'),
       ('game_15', 'team_4'),
       ('game_15', 'team_7'),
       ('game_16', 'team_1'),
       ('game_16', 'team_6'),
       ('game_17', 'team_2'),
       ('game_17', 'team_4'),
       ('game_18', 'team_5'),
       ('game_18', 'team_7'),
       ('game_19', 'team_1'),
       ('game_19', 'team_7'),
       ('game_20', 'team_2'),
       ('game_20', 'team_3'),
       ('game_21', 'team_4'),
       ('game_21', 'team_6'),
       ('game_22', 'team_1'),
       ('game_22', 'team_2'),
       ('game_23', 'team_3'),
       ('game_23', 'team_4'),
       ('game_24', 'team_5'),
       ('game_24', 'team_6'),
       ('game_25', 'team_1'),
       ('game_25', 'team_3'),
       ('game_26', 'team_5'),
       ('game_26', 'team_4'),
       ('game_27', 'team_6'),
       ('game_27', 'team_7'),
       ('game_28', 'team_1'),
       ('game_28', 'team_4'),
       ('game_29', 'team_2'),
       ('game_29', 'team_5'),
       ('game_30', 'team_7'),
       ('game_30', 'team_3'),
       ('game_31', 'team_1'),
       ('game_31', 'team_5'),
       ('game_32', 'team_6'),
       ('game_32', 'team_3'),
       ('game_33', 'team_2'),
       ('game_33', 'team_7'),
       ('game_34', 'team_3'),
       ('game_34', 'team_5'),
       ('game_35', 'team_2'),
       ('game_35', 'team_6'),
       ('game_36', 'team_4'),
       ('game_36', 'team_7'),
       ('game_37', 'team_1'),
       ('game_37', 'team_6'),
       ('game_38', 'team_2'),
       ('game_38', 'team_4'),
       ('game_39', 'team_5'),
       ('game_39', 'team_7'),
       ('game_40', 'team_1'),
       ('game_40', 'team_7'),
       ('game_41', 'team_2'),
       ('game_41', 'team_3'),
       ('game_42', 'team_4'),
       ('game_42', 'team_6');