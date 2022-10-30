package com.gberard.tournament.data.stats;

import com.gberard.tournament.data.contestant.Contestant;

public record ContestantStats(
        Contestant contestant,
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