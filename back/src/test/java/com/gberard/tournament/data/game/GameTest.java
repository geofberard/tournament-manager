package com.gberard.tournament.data.game;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.Game;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static com.gberard.tournament.data.game.ContestantResult.*;
import static com.gberard.tournament.data._TestUtils.*;
import static org.assertj.core.api.Assertions.assertThat;

class GameTest {

    @Nested
    @DisplayName("isFinished()")
    class IsFinished {

        @Test
        void should_no_be_finished() {
            assertThat(gameBuilder().build().isFinished()).isFalse();
        }

        @Test
        void should_be_finished() {
            assertThat(buildGame(teamA, 10, teamB, 9).isFinished()).isTrue();
            assertThat(buildGame(teamA, 12, teamB, 12).isFinished()).isTrue();
            assertThat(buildGame(teamA, 15, teamB, 24).isFinished()).isTrue();
        }

    }

    @Nested
    @DisplayName("getTeamStatus()")
    class GetContestantStatusTest {

        @Test
        void should_handle_status_not_played() {
            // When
            Game game = gameBuilder().build();

            // Then
            assertThat(game.getTeamStatus(teamA)).isEmpty();
            assertThat(game.getTeamStatus(teamB)).isEmpty();
        }

        @Test
        void should_handle_status_drawn() {
            // When
            Game game = buildGame(teamA, 10, teamB, 10);

            // Then
            assertThat(game.getTeamStatus(teamA).get()).isEqualTo(DRAWN);
            assertThat(game.getTeamStatus(teamB).get()).isEqualTo(DRAWN);
        }

        public static Stream<Arguments> wonScenario() {
            return Stream.of(
                    Arguments.of("A win", buildGame(teamA, 10, teamB, 9), teamA),
                    Arguments.of("B win", buildGame(teamA, 14, teamB, 25), teamB)
            );
        }

        @ParameterizedTest
        @MethodSource("wonScenario")
        void should_handle_status_won(String scenario, Game game, Contestant winner) {
            assertThat(game.getTeamStatus(winner).get()).isEqualTo(WIN);
        }

        public static Stream<Arguments> lostScenario() {
            return Stream.of(
                    Arguments.of("A win", buildGame(teamA, 10, teamB, 9), teamA),
                    Arguments.of("B win", buildGame(teamA, 15, teamB, 25), teamB)
            );
        }

        @ParameterizedTest
        @MethodSource("lostScenario")
        void should_handle_status_lost(String scenario, Game game, Contestant winner) {
            assertThat(game.getTeamStatus(winner).get()).isEqualTo(WIN);
        }
    }

    @Nested
    @DisplayName("getPointsFor()")
    class GetPointsFor {

        @Test
        void should_return_score_for_team_if_set() {
            // Given
            Game game = buildGame(teamA, 18, teamB, 12);

            // Then
            assertThat(game.getPointsFor(teamA)).isPresent();
            assertThat(game.getPointsFor(teamA).get())
                    .isEqualTo(game.score().get().getPointFor(teamA.id()));
            assertThat(game.getPointsFor(teamB)).isPresent();
            assertThat(game.getPointsFor(teamB).get())
                    .isEqualTo(game.score().get().getPointFor(teamB.id()));
        }

        @Test
        void should_return_empty_for_team_if_not_set() {
            // Given
            Game game = gameBuilder().build();

            // Then
            assertThat(game.getPointsFor(teamA)).isEmpty();
            assertThat(game.getPointsFor(teamB)).isEmpty();
        }

    }

    @Nested
    @DisplayName("getPointsAgainst()")
    class GetPointsAgainst {

        @Test
        void should_return_score_for_team_if_set() {
            // Given
            Game game = buildGame(teamA, 18, teamB, 12);

            // Then
            assertThat(game.getPointsAgainst(teamA)).isPresent();
            assertThat(game.getPointsAgainst(teamA).get())
                    .isEqualTo(game.score().get().getPointFor(teamB.id()));
            assertThat(game.getPointsAgainst(teamB)).isPresent();
            assertThat(game.getPointsAgainst(teamB).get())
                    .isEqualTo(game.score().get().getPointFor(teamA.id()));
        }

        @Test
        void should_return_empty_for_team_if_not_set() {
            // Given
            Game game = gameBuilder().build();

            // Then
            assertThat(game.getPointsAgainst(teamA)).isEmpty();
            assertThat(game.getPointsAgainst(teamB)).isEmpty();
        }

    }
}
