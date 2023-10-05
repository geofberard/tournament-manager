package com.gberard.tournament.domain.score;

import com.gberard.tournament.domain.stats.ContestantResult;

public interface Score {

    int getPointFor(String contestantId);

    int getPointAgainst(String contestantId);

    ContestantResult getTeamStatus(String contestantId);
}