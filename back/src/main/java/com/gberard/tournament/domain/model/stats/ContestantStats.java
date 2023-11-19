package com.gberard.tournament.domain.model.stats;

public record ContestantStats(
        String contestantId,
        int played,
        int won,
        int drawn,
        int lost,
        int score,
        int pointsFor,
        int pointsAgainst,
        int pointsDiff
) {
}