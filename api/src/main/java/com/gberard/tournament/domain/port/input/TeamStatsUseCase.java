package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.TeamStats;

import java.util.List;
import java.util.Optional;

public interface TeamStatsUseCase {

    List<TeamStats> getTeamsStats();

    TeamStats getTeamStats(Team team);

    List<TeamStats> getTeamsStatsByPool(String pool);

    Optional<String> getTeamPool(Team team);
}
