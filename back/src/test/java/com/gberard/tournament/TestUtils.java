package com.gberard.tournament;

import com.gberard.tournament.domain.client.Game;
import com.gberard.tournament.domain.score.DepthOneScore;
import com.gberard.tournament.domain.score.DepthTwoScore;
import com.gberard.tournament.domain.score.Score;
import org.assertj.core.api.ListAssert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import static com.gberard.tournament.domain.score.ScoreType.DepthOne;
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
                .contestantIds(List.of(TEAM_A, TEAM_B))
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

    public static DepthTwoScore buildDepthTwoScore(String teamA, List<Integer> scoresA,
                                                   String teamB, List<Integer> scoresB) {

        return new DepthTwoScore(IntStream.range(0,scoresA.size())
                .mapToObj(index -> new DepthOneScore(Map.of(teamA, scoresA.get(index), teamB, scoresB.get(index))))
                .toList()
        );
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
