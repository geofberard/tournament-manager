package com.gberard.tournament;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.GameBuilder;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.score.SimpleScore;
import com.gberard.tournament.domain.model.score.SetScore;
import com.gberard.tournament.domain.model.score.Score;
import org.assertj.core.api.ListAssert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import static com.gberard.tournament.domain.model.score.ScoreType.Simple;
import static java.time.Month.AUGUST;

public class TestUtils {

    public static Team TEAM_A = new Team("teamA", "teamA", List.of());
    public static Team TEAM_B = new Team("teamB", "teamB", List.of());
    public static Team TEAM_C = new Team("teamC", "teamC", List.of());
    public static Team TEAM_D = new Team("teamD", "teamD", List.of());
    public static Team TEAM_E = new Team("teamE", "teamE", List.of());

    public static GameBuilder gameBuilder() {
        return GameBuilder.newBuilder()
                .id("gameId")
                .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
                .contestants(List.of(TEAM_A, TEAM_B))
                .court("court")
                .isFinished(true)
                .scoreType(Simple);
    }

    public static Game buildGame(Team teamA, Integer scoreA, Team teamB, Integer scoreB) {
        return gameBuilder()
                .contestants(List.of(teamA, teamB))
                .scoreType(Simple)
                .score(buildSimpleScore(teamA, scoreA, teamB, scoreB))
                .build();
    }

    public static com.gberard.tournament.domain.model.score.SimpleScore buildSimpleScore(Team teamA, Integer scoreA, Team teamB, Integer scoreB) {
        return new SimpleScore(Map.of(teamA.id(), scoreA, teamB.id(), scoreB));
    }

    public static SetScore buildSetScore(Team teamA, List<Integer> scoresA,
                                         Team teamB, List<Integer> scoresB) {

        return new SetScore(IntStream.range(0,scoresA.size())
                .mapToObj(index -> new SimpleScore(Map.of(teamA.id(), scoresA.get(index), teamB.id(), scoresB.get(index))))
                .toList()
        );
    }

    public static List<Object> rawData(Object... values) {
        return List.of(values);
    }

    public static ListAssert<Integer> assertThatScore(Score score, String contestentId) {
        return switch (score) {
            case com.gberard.tournament.domain.model.score.SimpleScore s -> new ListAssert<>(List.of((s.result().get(contestentId))));
            case SetScore s -> new ListAssert<>(s.result().stream()
                    .map(depthOne -> depthOne.result().get(contestentId)));
            default -> throw new IllegalStateException("Unsuported score class : " + score.getClass());
        };
    }

}
