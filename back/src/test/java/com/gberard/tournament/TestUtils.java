package com.gberard.tournament;

import com.gberard.tournament.data.client.Game;
import com.gberard.tournament.data.score.DepthOneScore;
import com.gberard.tournament.data.score.DepthTwoScore;
import com.gberard.tournament.data.score.Score;
import org.assertj.core.api.ListAssert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static com.gberard.tournament.data.score.ScoreType.DepthOne;
import static java.time.Month.AUGUST;

public class TestUtils {

    public static String TEAM_A = "teamA";
    public static String TEAM_B = "teamB";
    public static String TEAM_C = "teamC";
    public static String TEAM_D = "teamD";
    public static String TEAM_E = "teamE";

    public static Game.GameBuilder gameBuilder() {
        return Game.builder()
                .id("gameId")
                .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
                .contestantIds(List.of(TEAM_A,TEAM_B))
                .court("court")
                .isFinished(true)
                .scoreType(DepthOne);
    }

    public static Game buildGame(String teamA, Integer scoreA, String teamB, Integer scoreB) {
        return gameBuilder()
                .contestantIds(List.of(teamA, teamB))
                .scoreType(DepthOne)
                .score(buildDepthOneScore(teamA, scoreA, teamB, scoreB))
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

    public static List<Object> rawData(Object... values) {
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
