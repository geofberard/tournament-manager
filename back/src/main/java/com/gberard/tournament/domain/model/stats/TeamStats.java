package com.gberard.tournament.domain.model.stats;

import com.gberard.tournament.domain.model.Team;

public record TeamStats(
        Team team,
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
