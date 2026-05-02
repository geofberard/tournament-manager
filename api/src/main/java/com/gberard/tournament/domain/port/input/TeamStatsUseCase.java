package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.TeamStats;

import java.util.List;
import java.util.Optional;

public interface TeamStatsUseCase {

    List<TeamStats> getTeamsStats();

    TeamStats getTeamStats(Team team);

    List<TeamStats> getTeamsStatsByGroup(String group);

    List<String> getPhaseGroups(String phaseId);

    List<TeamStats> getTeamsStatsByGroup(String group, String phaseId);

    Optional<String> getTeamGroup(Team team, String phaseId);
}
