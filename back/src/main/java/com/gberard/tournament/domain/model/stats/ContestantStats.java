package com.gberard.tournament.domain.model.stats;

import com.gberard.tournament.domain.model.Team;

public record ContestantStats(
        Team contestant,
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
