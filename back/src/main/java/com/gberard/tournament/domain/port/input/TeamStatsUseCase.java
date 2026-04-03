package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.TeamStats;

import java.util.List;

public interface TeamStatsUseCase {

    List<TeamStats> getTeamsStats();

    TeamStats getTeamStats(Team team);
}
