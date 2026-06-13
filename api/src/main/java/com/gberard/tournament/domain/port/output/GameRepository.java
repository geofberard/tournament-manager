package com.gberard.tournament.domain.port.output;

import com.gberard.tournament.domain.model.Game;

import java.util.List;
import java.util.Optional;

public interface GameRepository {

    List<Game> findAll();

    Optional<Game> findById(String id);

    boolean existsByTeamId(String teamId);

    boolean existsByPhaseId(String phaseId);

    List<Game> findByTeamId(String teamId);

    List<Game> findByGroup(String group);

    List<Game> findByPhaseId(String phaseId);

    List<Game> findByGroupAndPhaseId(String group, String phaseId);

    List<Game> findByTeamIdAndPhaseId(String teamId, String phaseId);

    Game save(Game game);

    void deleteById(String id);
}
