package com.gberard.tournament;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.GameBuilder;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.PhaseType;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.score.SimpleScore;
import org.assertj.core.api.ListAssert;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import static java.time.Month.AUGUST;

public class TestUtils {

    public static Team TEAM_A = new Team("teamA", "teamA");
    public static Team TEAM_B = new Team("teamB", "teamB");
    public static Team TEAM_C = new Team("teamC", "teamC");
    public static Team TEAM_D = new Team("teamD", "teamD");
    public static Team TEAM_E = new Team("teamE", "teamE");
    public static Phase PHASE_A = new Phase("phaseA", "Brassage", null, 1, PhaseType.POOL);

    public static GameBuilder gameBuilder() {
        return GameBuilder.newBuilder()
                .id("gameId")
                .phase(PHASE_A)
                .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
                .contestants(List.of(TEAM_A, TEAM_B))
                .court("court")
                .position(1000L)
                .status(com.gberard.tournament.domain.model.GameStatus.COMPLETED)
                .eraseScore();
    }

    public static Game buildGame(Team teamA, Integer scoreA, Team teamB, Integer scoreB) {
        return gameBuilder()
                .contestants(List.of(teamA, teamB))
                .score(buildSimpleScore(teamA, scoreA, teamB, scoreB))
                .build();
    }

    public static SimpleScore buildSimpleScore(Team teamA, Integer scoreA, Team teamB, Integer scoreB) {
        return new SimpleScore(Map.of(teamA.id(), scoreA, teamB.id(), scoreB));
    }

    public static List<Object> rawData(Object... values) {
        return List.of(values);
    }

    public static ListAssert<Integer> assertThatScore(SimpleScore score, String teamId) {
        return new ListAssert<>(List.of(score.result().get(teamId)));
    }

}
