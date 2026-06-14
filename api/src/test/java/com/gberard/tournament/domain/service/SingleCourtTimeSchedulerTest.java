package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.scheduling.PlannedGame;
import com.gberard.tournament.domain.model.scheduling.TeamPair;
import org.junit.jupiter.api.Test;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static com.gberard.tournament.TestUtils.TEAM_C;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class SingleCourtTimeSchedulerTest {

    private static final LocalDateTime START_TIME = LocalDateTime.parse("2026-06-20T09:00:00");

    private final SingleCourtTimeScheduler scheduler = new SingleCourtTimeScheduler();

    @Test
    void shouldScheduleMatchupsSequentiallyUsingGameAndBreakDurations() {
        // GIVEN
        List<TeamPair> teamPairs = List.of(
                new TeamPair(TEAM_A, TEAM_B),
                new TeamPair(TEAM_A, TEAM_C),
                new TeamPair(TEAM_B, TEAM_C)
        );

        // WHEN
        List<PlannedGame> plannedGames = scheduler.schedule(
                teamPairs,
                START_TIME,
                Duration.ofMinutes(12),
                Duration.ofMinutes(3)
        );

        // THEN
        assertThat(plannedGames).extracting(PlannedGame::teamPair)
                .containsExactlyElementsOf(teamPairs);
        assertThat(plannedGames).extracting(PlannedGame::time).containsExactly(
                START_TIME,
                START_TIME.plusMinutes(15),
                START_TIME.plusMinutes(30)
        );
        assertThat(plannedGames).allSatisfy(game -> assertThat(game.referee()).isEmpty());
    }

    @Test
    void shouldAcceptNoBreakBetweenGames() {
        // GIVEN
        // WHEN
        var plannedGames = scheduler.schedule(
                List.of(
                        new TeamPair(TEAM_A, TEAM_B),
                        new TeamPair(TEAM_A, TEAM_C)
                ),
                START_TIME,
                Duration.ofMinutes(10),
                Duration.ZERO
        );

        // THEN
        assertThat(plannedGames).extracting(PlannedGame::time)
                .containsExactly(START_TIME, START_TIME.plusMinutes(10));
    }

    @Test
    void shouldRejectNonPositiveGameDuration() {
        // WHEN / THEN
        assertThatThrownBy(() -> scheduler.schedule(
                List.of(),
                START_TIME,
                Duration.ZERO,
                Duration.ZERO
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("gameDuration must be positive");
    }

    @Test
    void shouldRejectNegativeBreakDuration() {
        // WHEN / THEN
        assertThatThrownBy(() -> scheduler.schedule(
                List.of(),
                START_TIME,
                Duration.ofMinutes(10),
                Duration.ofMinutes(-1)
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("breakDuration must not be negative");
    }

    @Test
    void shouldRejectNullTeamPairs() {
        // WHEN / THEN
        assertThatThrownBy(() -> scheduler.schedule(
                null,
                START_TIME,
                Duration.ofMinutes(10),
                Duration.ZERO
        )).isInstanceOf(IllegalArgumentException.class)
                .hasMessage("teamPairs must not be null");
    }
}
