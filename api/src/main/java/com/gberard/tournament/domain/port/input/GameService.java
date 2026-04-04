package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;

import java.util.List;
import java.util.Optional;

public interface GameService {

    Game create(Game game);

    Game update(Game game);

    boolean delete(Game game);

    Optional<Game> findById(String id);

    List<Game> findAll();

    List<Game> findByTeam(Team team);

}
