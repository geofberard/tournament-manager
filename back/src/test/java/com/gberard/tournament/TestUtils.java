package com.gberard.tournament;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.score.DepthOneScore;
import com.gberard.tournament.domain.model.score.DepthTwoScore;
import com.gberard.tournament.domain.model.score.Score;
import org.assertj.core.api.ListAssert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import static com.gberard.tournament.domain.model.score.ScoreType.DepthOne;
import static java.time.Month.AUGUST;

public class TestUtils {

    public static Team TEAM_A = new Team("teamA", "teamA", List.of());
    public static Team TEAM_B = new Team("teamB", "teamB", List.of());
    public static Team TEAM_C = new Team("teamC", "teamC", List.of());
    public static Team TEAM_D = new Team("teamD", "teamD", List.of());
    public static Team TEAM_E = new Team("teamE", "teamE", List.of());

    public static Game.GameBuilder gameBuilder() {
        return Game.builder()
                .id("gameId")
                .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
                .contestants(List.of(TEAM_A, TEAM_B))
                .court("court")
                .isFinished(true)
                .scoreType(DepthOne);
    }

    public static Game buildGame(Team teamA, Integer scoreA, Team teamB, Integer scoreB) {
        return gameBuilder()
                .contestants(List.of(teamA, teamB))
                .scoreType(DepthOne)
                .score(buildDepthOneScore(teamA, scoreA, teamB, scoreB))
                .build();
    }

    public static DepthOneScore buildDepthOneScore(Team teamA, Integer scoreA, Team teamB, Integer scoreB) {
        return new DepthOneScore(Map.of(teamA.id(), scoreA, teamB.id(), scoreB));
    }

    public static DepthTwoScore buildDepthTwoScore(Team teamA, List<Integer> scoresA,
                                                   Team teamB, List<Integer> scoresB) {

        return new DepthTwoScore(IntStream.range(0,scoresA.size())
                .mapToObj(index -> new DepthOneScore(Map.of(teamA.id(), scoresA.get(index), teamB.id(), scoresB.get(index))))
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
