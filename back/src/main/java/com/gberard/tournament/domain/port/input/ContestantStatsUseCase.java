package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.stats.ContestantStats;

import java.util.List;

public interface ContestantStatsUseCase {

    List<ContestantStats> getContestantsStats();

    ContestantStats getContestantStats(String contestantId);
}
