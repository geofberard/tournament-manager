package com.gberard.tournament.application.dto;

import com.gberard.tournament.domain.model.stats.ContestantStats;

public record ContestantStatsDTO(
        TeamDTO contestant,
        int played,
        int won,
        int drawn,
        int lost,
        int score,
        int pointsFor,
        int pointsAgainst,
        int pointsDiff
) {

    public static ContestantStatsDTO fromContestantStats(ContestantStats stats) {
        return new ContestantStatsDTO(
                TeamDTO.toTeamDTO(stats.contestant()),
                stats.played(),
                stats.won(),
                stats.drawn(),
                stats.lost(),
                stats.score(),
                stats.pointsFor(),
                stats.pointsAgainst(),
                stats.pointsDiff()
        );
    }
}
