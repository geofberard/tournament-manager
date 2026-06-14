package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

import static com.gberard.tournament.TestUtils.PHASE_A;
import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static com.gberard.tournament.TestUtils.TEAM_C;
import static com.gberard.tournament.TestUtils.TEAM_D;
import static org.assertj.core.api.Assertions.assertThat;

class PoolGamePlanningServiceTest {

    private static final LocalDateTime START_TIME = LocalDateTime.parse("2026-06-20T09:00:00");

    private final PoolGamePlanningService planningService = new PoolGamePlanningService(
            new RoundRobinTeamPairGenerator(),
            new SingleCourtTimeScheduler(),
            new TeamRefereeAllocator(),
            new TeamOrderRandomizer(new Random(42))
    );

    @Test
    void shouldCreateOnlyCompletePersistableGamesWithoutReferees() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C);

        // WHEN
        List<Game> games = planningService.plan(
                PHASE_A,
                "Poule A",
                teams,
                START_TIME,
                Duration.ofMinutes(12),
                Duration.ofMinutes(3),
                "Terrain 1",
                false
        );

        // THEN
        assertThat(games).hasSize(3).allSatisfy(game -> {
            assertThat(game.id()).isNull();
            assertThat(game.phase()).isEqualTo(PHASE_A);
            assertThat(game.group()).isEqualTo("Poule A");
            assertThat(game.court()).isEqualTo("Terrain 1");
            assertThat(game.contestants()).hasSize(2);
            assertThat(game.refereeId()).isEmpty();
            assertThat(game.isFinished()).isFalse();
            assertThat(game.score()).isEmpty();
        });
    }

    @Test
    void shouldCreateGamesWithRefereesWhenRequested() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C);

        // WHEN
        List<Game> games = planningService.plan(
                PHASE_A,
                "Poule A",
                teams,
                START_TIME,
                Duration.ofMinutes(12),
                Duration.ofMinutes(3),
                "Terrain 1",
                true
        );

        // THEN
        assertThat(games).allSatisfy(game -> {
            assertThat(game.refereeId()).isPresent();
            assertThat(game.contestants()).doesNotContain(game.refereeId().orElseThrow());
        });
    }

    @Test
    void shouldGenerateTheRoundRobinFromTheShuffledTeamOrder() {
        // GIVEN
        List<Team> teams = List.of(TEAM_A, TEAM_B, TEAM_C, TEAM_D);

        // WHEN
        List<Game> games = planningService.plan(
                PHASE_A,
                "Poule A",
                teams,
                START_TIME,
                Duration.ofMinutes(12),
                Duration.ofMinutes(3),
                "Terrain 1",
                false
        );

        // THEN
        assertThat(games.getFirst().contestants()).containsExactly(TEAM_D, TEAM_C);
        assertThat(teams).containsExactly(TEAM_A, TEAM_B, TEAM_C, TEAM_D);
    }
}
