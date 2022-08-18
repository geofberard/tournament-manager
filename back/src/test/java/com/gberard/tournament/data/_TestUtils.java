package com.gberard.tournament.data;

import java.time.LocalDateTime;

public class _TestUtils {

    public static Team teamA = new Team("teamA", "TeamA");
    public static Team teamB = new Team("teamB", "TeamB");
    public static Team teamC = new Team("teamC", "TeamC");
    public static Team teamD = new Team("teamD", "TeamD");
    public static Team teamE = new Team("teamE", "TeamE");

    public static GameBuilder gameBuilder() {
        return new GameBuilder()
                .setTime(LocalDateTime.now())
                .setCourt("court")
                .setTeamA(teamA)
                .setTeamB(teamB);
    }

    public static Game buildGame(Team teamA, int scoreA, Team teamB, int scoreB) {
        return gameBuilder()
                .setTeamA(teamA)
                .setScoreA(scoreA)
                .setTeamB(teamB)
                .setScoreB(scoreB)
                .createGame();
    }

}
