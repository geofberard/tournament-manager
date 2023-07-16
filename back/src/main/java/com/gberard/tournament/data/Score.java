package com.gberard.tournament.data;

public interface Score {
    String getSummary();

    int getPointFor(String contestantId);

    int getPointAgainst(String contestantId);

    ContestantResult getTeamStatus(String contestantId);
}