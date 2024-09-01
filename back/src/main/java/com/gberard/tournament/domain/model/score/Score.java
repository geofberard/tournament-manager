package com.gberard.tournament.domain.model.score;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.ContestantResult;

public interface Score {

    int getPointFor(Team team);

    int getPointAgainst(Team team);

    ContestantResult getTeamStatus(Team team);

    boolean hasContestant(Team team);
}
