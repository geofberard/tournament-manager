package com.gberard.tournament.data;

public record TeamStatsV1(
        TeamV1 team,
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