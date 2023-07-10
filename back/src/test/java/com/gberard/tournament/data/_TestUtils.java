package com.gberard.tournament.data;

import java.time.LocalDateTime;
import java.util.List;

import static java.time.Month.AUGUST;

public class _TestUtils {

    public static TeamV1 teamA = new TeamV1("teamA", "TeamA");
    public static TeamV1 teamB = new TeamV1("teamB", "TeamB");
    public static TeamV1 teamC = new TeamV1("teamC", "TeamC");
    public static TeamV1 teamD = new TeamV1("teamD", "TeamD");
    public static TeamV1 teamE = new TeamV1("teamE", "TeamE");

    public static GameV1 game1 = GameV1.builder()
            .id("game1")
            .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
            .court("court")
            .teamA(teamA)
            .teamB(teamB)
            .referee(teamC)
            .scoreA(25)
            .scoreB(14)
            .build();

    public static GameV1 game2 = GameV1.builder()
            .id("game2")
            .time(LocalDateTime.of(2022, AUGUST, 29, 11, 30))
            .court("court")
            .teamA(teamC)
            .teamB(teamB)
            .build();

    public static GameV1.GameV1Builder gameBuilder() {
        return GameV1.builder()
                .time(LocalDateTime.now())
                .court("court")
                .teamA(teamA)
                .teamB(teamB);
    }

    public static GameV1 buildGame(TeamV1 teamA, int scoreA, TeamV1 teamB, int scoreB) {
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
