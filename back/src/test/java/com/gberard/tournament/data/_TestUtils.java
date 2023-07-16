package com.gberard.tournament.data;

import java.time.LocalDateTime;
import java.util.List;

import static java.time.Month.AUGUST;

public class _TestUtils {

    public static Player playerA = createPlayer("A");
    public static Player playerB = createPlayer("B");
    public static Player playerC = createPlayer("C");
    public static Player playerD = createPlayer("D");
    public static Player playerE = createPlayer("E");

    public static Player createPlayer(String id) {
        return new Player("player"+ id, "playerFirstname" + id, "playerLastname" + id);
    }

    public static Team teamA = new Team("teamA", "TeamA", List.of());
    public static Team teamB = new Team("teamB", "TeamB", List.of());
    public static Team teamC = new Team("teamC", "TeamC", List.of());
    public static Team teamD = new Team("teamD", "TeamD", List.of());
    public static Team teamE = new Team("teamE", "TeamE", List.of());

    public static TeamV1 oldTeamA = new TeamV1("teamA", "TeamA");
    public static TeamV1 oldTeamB = new TeamV1("teamB", "TeamB");
    public static TeamV1 oldTeamC = new TeamV1("teamC", "TeamC");
    public static TeamV1 oldTeamD = new TeamV1("teamD", "TeamD");
    public static TeamV1 oldTeamE = new TeamV1("teamE", "TeamE");

    public static GameV1 game1 = GameV1.builder()
            .id("game1")
            .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
            .court("court")
            .teamA(oldTeamA)
            .teamB(oldTeamB)
            .referee(oldTeamC)
            .scoreA(25)
            .scoreB(14)
            .build();

    public static GameV1 game2 = GameV1.builder()
            .id("game2")
            .time(LocalDateTime.of(2022, AUGUST, 29, 11, 30))
            .court("court")
            .teamA(oldTeamC)
            .teamB(oldTeamB)
            .build();

    public static GameV1.GameV1Builder gameBuilder() {
        return GameV1.builder()
                .time(LocalDateTime.now())
                .court("court")
                .teamA(oldTeamA)
                .teamB(oldTeamB);
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
