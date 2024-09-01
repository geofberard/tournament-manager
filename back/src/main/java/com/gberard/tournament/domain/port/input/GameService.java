package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;

import java.util.List;

public interface GameService extends DataService<Game> {

    List<Game> findByTeam(Team team);

}
