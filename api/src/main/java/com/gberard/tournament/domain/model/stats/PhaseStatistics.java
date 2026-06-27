package com.gberard.tournament.domain.model.stats;

import com.gberard.tournament.domain.model.Team;

import java.util.List;
import java.util.Objects;

public record PhaseStatistics(
        long gameCount,
        double completionRate,
        List<Team> teams,
        List<TeamStats> teamStats
) {
    public PhaseStatistics(long gameCount, double completionRate) {
        this(gameCount, completionRate, List.of(), List.of());
    }

    public PhaseStatistics {
        teams = List.copyOf(Objects.requireNonNull(teams, "teams must not be null"));
        teamStats = List.copyOf(Objects.requireNonNull(teamStats, "teamStats must not be null"));
    }
}
