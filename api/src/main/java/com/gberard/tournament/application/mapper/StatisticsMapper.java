package com.gberard.tournament.application.mapper;

import com.gberard.tournament.domain.model.stats.TeamStats;

public final class StatisticsMapper {

    public static com.gberard.tournament.generated.model.ContestantStats toApi(
            TeamStats stats
    ) {
        return new com.gberard.tournament.generated.model.ContestantStats()
                .contestant(TeamMapper.toApi(stats.team()))
                .played(stats.played())
                .won(stats.won())
                .drawn(stats.drawn())
                .lost(stats.lost())
                .score(stats.score())
                .pointsFor(stats.pointsFor())
                .pointsAgainst(stats.pointsAgainst())
                .pointsDiff(stats.pointsDiff());
    }

    public static com.gberard.tournament.generated.model.PhaseStatistics toApi(
            com.gberard.tournament.domain.model.stats.PhaseStatistics statistics
    ) {
        return new com.gberard.tournament.generated.model.PhaseStatistics()
                .gameCount(statistics.gameCount())
                .completionRate(statistics.completionRate())
                .teams(statistics.teams().stream()
                        .map(TeamMapper::toApi)
                        .toList())
                .teamStats(statistics.teamStats().stream()
                        .map(StatisticsMapper::toApi)
                        .toList());
    }

}
