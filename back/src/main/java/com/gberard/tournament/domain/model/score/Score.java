package com.gberard.tournament.domain.model.score;

import com.gberard.tournament.domain.model.stats.ContestantResult;

public interface Score {

    int getPointFor(String contestantId);

    int getPointAgainst(String contestantId);

    ContestantResult getTeamStatus(String contestantId);
}
