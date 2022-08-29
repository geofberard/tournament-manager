package com.gberard.tournament.data;

import java.time.LocalDateTime;
import java.util.List;

public class _TestUtils {

    public static Team teamA = new Team("teamA", "TeamA");
    public static Team teamB = new Team("teamB", "TeamB");
    public static Team teamC = new Team("teamC", "TeamC");
    public static Team teamD = new Team("teamD", "TeamD");
    public static Team teamE = new Team("teamE", "TeamE");

    public static Game.GameBuilder gameBuilder() {
        return Game.builder()
                .time(LocalDateTime.now())
                .court("court")
                .teamA(teamA)
                .teamB(teamB);
    }

    public static Game buildGame(Team teamA, int scoreA, Team teamB, int scoreB) {
        return gameBuilder()
                .teamA(teamA)
                .scoreA(scoreA)
                .teamB(teamB)
                .scoreB(scoreB)
                .build();
    }

    public static List<Object> rawData(Object...values) {
        return List.of(values);
    }

}
