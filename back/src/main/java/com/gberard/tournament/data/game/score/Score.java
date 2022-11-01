package com.gberard.tournament.data.game.score;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.ContestantResult;
import org.springframework.stereotype.Component;

public interface Score {

    default int getPointFor(Contestant contestant) {
        return getPointFor(contestant.id());
    }

    int getPointFor(String contestantId);

    default int getPointAgainst(Contestant contestant) {
        return getPointAgainst(contestant.id());
    }

    int getPointAgainst(String contestantId);

    default ContestantResult getTeamStatus(Contestant contestant) {
        return getTeamStatus(contestant.id());
    }

    ContestantResult getTeamStatus(String contestantId);

}