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

}
