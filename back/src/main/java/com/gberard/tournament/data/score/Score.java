package com.gberard.tournament.data.score;

import com.gberard.tournament.data.stats.ContestantResult;

public interface Score {
    String getSummary();

    int getPointFor(String contestantId);

    int getPointAgainst(String contestantId);

    ContestantResult getTeamStatus(String contestantId);
}