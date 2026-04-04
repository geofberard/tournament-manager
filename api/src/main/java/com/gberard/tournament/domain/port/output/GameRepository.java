package com.gberard.tournament.domain.port.output;

import com.gberard.tournament.domain.model.Game;

import java.util.List;
import java.util.Optional;

public interface GameRepository {

    List<Game> findAll();

    Optional<Game> findById(String id);

    List<Game> findByTeamId(String teamId);

    Game save(Game game);

    void deleteById(String id);
}
