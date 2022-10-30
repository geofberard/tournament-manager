package com.gberard.tournament.data.game.score;

import com.gberard.tournament.data.game.ContestantResult;

public interface Score {

    int getPointFor(String contestantId);

    int getPointAgainst(String contestantId);

    ContestantResult getTeamStatus(String contestantId);

}