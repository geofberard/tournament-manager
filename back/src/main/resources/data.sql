-- Insérer des données dans la table players
INSERT INTO players (id, firstname, lastname)
VALUES ('1', 'Luke', 'Skywalker'),
       ('2', 'Leia', 'Organa'),
       ('3', 'Han', 'Solo'),
       ('4', 'Chewbacca', ''),
       ('5', 'Darth', 'Vader'),
       ('6', 'Marty', 'McFly'),
       ('7', 'Doc', 'Brown'),
       ('8', 'Biff', 'Tannen'),
       ('9', 'Jennifer', 'Parker'),
       ('10', 'George', 'McFly'),
       ('11', 'Rachel', 'Green'),
       ('12', 'Monica', 'Geller'),
       ('13', 'Phoebe', 'Buffay'),
       ('14', 'Joey', 'Tribbiani'),
       ('15', 'Chandler', 'Bing'),
       ('16', 'Ross', 'Geller'),
       ('17', 'Hannibal', 'Smith'),
       ('18', 'B.A.', 'Baracus'),
       ('19', 'Face', 'Peck'),
       ('20', 'Howling Mad', 'Murdock'),
       ('21', 'Leonardo', ''),
       ('22', 'Michelangelo', ''),
       ('23', 'Donatello', ''),
       ('24', 'Raphael', ''),
       ('25', 'Splinter', ''),
       ('26', 'Athos', ''),
       ('27', 'Porthos', ''),
       ('28', 'Aramis', ''),
       ('29', 'D''Artagnan', ''),
       ('30', 'Harry', 'Potter'),
       ('31', 'Hermione', 'Granger'),
       ('32', 'Ron', 'Weasley'),
       ('33', 'Albus', 'Dumbledore'),
       ('34', 'Severus', 'Snape'),
       ('35', 'Alan', 'Grant'),
       ('36', 'Ellie', 'Sattler'),
       ('37', 'Ian', 'Malcolm'),
       ('38', 'John', 'Hammond'),
       ('39', 'Robert', 'Muldoon');

-- Insérer des données dans la table team
INSERT INTO teams (id, name)
VALUES ('1', 'Star Wars Heroes'),
       ('2', 'Back to the Future Crew'),
       ('3', 'Friends'),
       ('4', 'The A-Team'),
       ('5', 'Teenage Mutant Ninja Turtles'),
       ('6', 'Mousquetaires'),
       ('7', 'Harry Potter'),
       ('8', 'Jurassic Park Team');

-- Insérer des données dans la table team_players
INSERT INTO team_players (team_id, player_id)
VALUES ('1', '1'),  -- Luke Skywalker in Star Wars Heroes
       ('1', '2'),  -- Leia Organa in Star Wars Heroes
       ('1', '3'),  -- Han Solo in Star Wars Heroes
       ('1', '4'),  -- Chewbacca in Star Wars Heroes
       ('1', '5'),  -- Darth Vader in Star Wars Heroes
       ('2', '6'),  -- Marty McFly in Back to the Future Crew
       ('2', '7'),  -- Doc Brown in Back to the Future Crew
       ('2', '8'),  -- Biff Tannen in Back to the Future Crew
       ('2', '9'),  -- Jennifer Parker in Back to the Future Crew
       ('2', '10'), -- George McFly in Back to the Future Crew
       ('3', '11'), -- Rachel Green in Friends
       ('3', '12'), -- Monica Geller in Friends
       ('3', '13'), -- Phoebe Buffay in Friends
       ('3', '14'), -- Joey Tribbiani in Friends
       ('3', '15'), -- Chandler Bing in Friends
       ('3', '16'), -- Ross Geller in Friends
       ('4', '17'), -- Hannibal Smith in The A-Team
       ('4', '18'), -- B.A. Baracus in The A-Team
       ('4', '19'), -- Face Peck in The A-Team
       ('4', '20'), -- Howling Mad Murdock in The A-Team
       ('5', '21'), -- Leonardo in Teenage Mutant Ninja Turtles
       ('5', '22'), -- Michelangelo in Teenage Mutant Ninja Turtles
       ('5', '23'), -- Donatello in Teenage Mutant Ninja Turtles
       ('5', '24'), -- Raphael in Teenage Mutant Ninja Turtles
       ('5', '25'), -- Splinter in Teenage Mutant Ninja Turtles
       ('6', '26'), -- Athos in Mousquetaires
       ('6', '27'), -- Porthos in Mousquetaires
       ('6', '28'), -- Aramis in Mousquetaires
       ('6', '29'), -- D'Artagnan in Mousquetaires
       ('7', '30'), -- Harry Potter in Harry Potter
       ('7', '31'), -- Hermione Granger in Harry Potter
       ('7', '32'), -- Ron Weasley in Harry Potter
       ('7', '33'), -- Albus Dumbledore in Harry Potter
       ('7', '34'), -- Severus Snape in Harry Potter
       ('8', '35'), -- Alan Grant in Jurassic Park Team
       ('8', '36'), -- Ellie Sattler in Jurassic Park Team
       ('8', '37'), -- Ian Malcolm in Jurassic Park Team
       ('8', '38'), -- John Hammond in Jurassic Park Team
       ('8', '39'); -- Robert Muldoon in Jurassic Park Team
