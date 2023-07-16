package com.gberard.tournament.data;

import org.assertj.core.api.ListAssert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static java.time.Month.AUGUST;

public class _TestUtils {

    public static TeamV1 oldTeamA = new TeamV1("teamA", "TeamA");
    public static TeamV1 oldTeamB = new TeamV1("teamB", "TeamB");
    public static TeamV1 oldTeamC = new TeamV1("teamC", "TeamC");
    public static TeamV1 oldTeamD = new TeamV1("teamD", "TeamD");
    public static TeamV1 oldTeamE = new TeamV1("teamE", "TeamE");

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

    public static DepthOneScore buildDepthOneScore(String teamA, Integer scoreA, String teamB, Integer scoreB) {
        return new DepthOneScore(Map.of(teamA, scoreA, teamB, scoreB));
    }

    public static DepthTwoScore buildDepthTwoScore(String teamA, Integer scoreA1, Integer scoreA2,
                                                   String teamB, Integer scoreB1, Integer scoreB2) {
        return new DepthTwoScore(List.of(
                new DepthOneScore(Map.of(teamA, scoreA1, teamB, scoreB1)),
                new DepthOneScore(Map.of(teamA, scoreA2, teamB, scoreB2))
        ));
    }

    public static List<Object> rawData(Object...values) {
        return List.of(values);
    }

    public static ListAssert<Integer> assertThatScore(Score score, String contestentId) {
        return switch (score) {
            case DepthOneScore s -> new ListAssert<>(List.of((s.result().get(contestentId))));
            case DepthTwoScore s -> new ListAssert<>(s.result().stream()
                    .map(depthOne -> depthOne.result().get(contestentId)));
            default -> throw new IllegalStateException("Unsuported score class : " + score.getClass());
        };
    }

}
