package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.stats.ContestantStats;

import java.util.List;

public interface ContestantStatsUseCase {

    List<ContestantStats> getContestantsStats();

    ContestantStats getContestantStats(String contestantId);
}
