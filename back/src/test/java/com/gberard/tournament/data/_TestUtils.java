package com.gberard.tournament.data;

import java.time.LocalDateTime;
import java.util.List;

import static java.time.Month.AUGUST;

public class _TestUtils {

    public static Team teamA = new Team("teamA", "TeamA");
    public static Team teamB = new Team("teamB", "TeamB");
    public static Team teamC = new Team("teamC", "TeamC");
    public static Team teamD = new Team("teamD", "TeamD");
    public static Team teamE = new Team("teamE", "TeamE");

    public static Game game1 = Game.builder()
            .id("game1")
            .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
            .court("court")
            .teamA(teamA)
            .teamB(teamB)
            .referee(teamC)
            .scoreA(25)
            .scoreB(14)
            .build();

    public static Game game2 = Game.builder()
            .id("game2")
            .time(LocalDateTime.of(2022, AUGUST, 29, 11, 30))
            .court("court")
            .teamA(teamC)
            .teamB(teamB)
            .build();

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
