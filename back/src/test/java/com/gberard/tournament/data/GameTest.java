package com.gberard.tournament.data;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static com.gberard.tournament.data.GameTeamStatus.*;
import static com.gberard.tournament.data._TestUtils.*;
import static org.assertj.core.api.Assertions.assertThat;

class GameTest {

    @Nested
    @DisplayName("isFinished()")
    class IsFinished {

        @Test
        void should_no_be_finished() {
            assertThat(gameBuilder().build().isFinished()).isFalse();
            assertThat(gameBuilder().scoreA(10).build().isFinished()).isFalse();
            assertThat(gameBuilder().scoreB(20).build().isFinished()).isFalse();
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
    class GetTeamStatusTest {

        public static Stream<Arguments> notPlayedScenario() {
            return Stream.of(
                    Arguments.of("no score", gameBuilder()),
                    Arguments.of("only scoreA", gameBuilder().scoreA(10)),
                    Arguments.of("only scoreB", gameBuilder().scoreB(20))
            );
        }

        @ParameterizedTest
        @MethodSource("notPlayedScenario")
        void should_handle_status_not_played(String scenario, Game.GameBuilder builder) {
            // When
            Game game = builder.build();

            // Then
            assertThat(game.getTeamStatus(teamA)).isEqualTo(NOT_PLAYED);
            assertThat(game.getTeamStatus(teamB)).isEqualTo(NOT_PLAYED);
        }

        @Test
        void should_handle_status_drawn() {
            // When
            Game game = buildGame(teamA, 10, teamB, 10);

            // Then
            assertThat(game.getTeamStatus(teamA)).isEqualTo(DRAWN);
            assertThat(game.getTeamStatus(teamB)).isEqualTo(DRAWN);
        }

        public static Stream<Arguments> wonScenario() {
            return Stream.of(
                    Arguments.of("A win", buildGame(teamA, 10, teamB, 9), teamA),
                    Arguments.of("B win", buildGame(teamA, 14, teamB, 25), teamB)
            );
        }

        @ParameterizedTest
        @MethodSource("wonScenario")
        void should_handle_status_won(String scenario, Game game, Team winner) {
            assertThat(game.getTeamStatus(winner)).isEqualTo(WIN);
        }

        public static Stream<Arguments> lostScenario() {
            return Stream.of(
                    Arguments.of("A win", buildGame(teamA, 10, teamB, 9), teamA),
                    Arguments.of("B win", buildGame(teamA, 15, teamB, 25), teamB)
            );
        }

        @ParameterizedTest
        @MethodSource("lostScenario")
        void should_handle_status_lost(String scenario, Game game, Team winner) {
            assertThat(game.getTeamStatus(winner)).isEqualTo(WIN);
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
            assertThat(game.getPointsFor(teamA)).isEqualTo(game.scoreA());
            assertThat(game.getPointsFor(teamB)).isPresent();
            assertThat(game.getPointsFor(teamB)).isEqualTo(game.scoreB());
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
            assertThat(game.getPointsAgainst(teamA)).isEqualTo(game.scoreB());
            assertThat(game.getPointsAgainst(teamB)).isPresent();
            assertThat(game.getPointsAgainst(teamB)).isEqualTo(game.scoreA());
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
