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
            assertThat(buildGame(oldTeamA, 10, oldTeamB, 9).isFinished()).isTrue();
            assertThat(buildGame(oldTeamA, 12, oldTeamB, 12).isFinished()).isTrue();
            assertThat(buildGame(oldTeamA, 15, oldTeamB, 24).isFinished()).isTrue();
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
        void should_handle_status_not_played(String scenario, GameV1.GameV1Builder builder) {
            // When
            GameV1 game = builder.build();

            // Then
            assertThat(game.getTeamStatus(oldTeamA)).isEqualTo(NOT_PLAYED);
            assertThat(game.getTeamStatus(oldTeamB)).isEqualTo(NOT_PLAYED);
        }

        @Test
        void should_handle_status_drawn() {
            // When
            GameV1 game = buildGame(oldTeamA, 10, oldTeamB, 10);

            // Then
            assertThat(game.getTeamStatus(oldTeamA)).isEqualTo(DRAWN);
            assertThat(game.getTeamStatus(oldTeamB)).isEqualTo(DRAWN);
        }

        public static Stream<Arguments> wonScenario() {
            return Stream.of(
                    Arguments.of("A win", buildGame(oldTeamA, 10, oldTeamB, 9), oldTeamA),
                    Arguments.of("B win", buildGame(oldTeamA, 14, oldTeamB, 25), oldTeamB)
            );
        }

        @ParameterizedTest
        @MethodSource("wonScenario")
        void should_handle_status_won(String scenario, GameV1 game, TeamV1 winner) {
            assertThat(game.getTeamStatus(winner)).isEqualTo(WIN);
        }

        public static Stream<Arguments> lostScenario() {
            return Stream.of(
                    Arguments.of("A win", buildGame(oldTeamA, 10, oldTeamB, 9), oldTeamA),
                    Arguments.of("B win", buildGame(oldTeamA, 15, oldTeamB, 25), oldTeamB)
            );
        }

        @ParameterizedTest
        @MethodSource("lostScenario")
        void should_handle_status_lost(String scenario, GameV1 game, TeamV1 winner) {
            assertThat(game.getTeamStatus(winner)).isEqualTo(WIN);
        }
    }

    @Nested
    @DisplayName("getPointsFor()")
    class GetPointsFor {

        @Test
        void should_return_score_for_team_if_set() {
            // Given
            GameV1 game = buildGame(oldTeamA, 18, oldTeamB, 12);

            // Then
            assertThat(game.getPointsFor(oldTeamA)).isPresent();
            assertThat(game.getPointsFor(oldTeamA)).isEqualTo(game.scoreA());
            assertThat(game.getPointsFor(oldTeamB)).isPresent();
            assertThat(game.getPointsFor(oldTeamB)).isEqualTo(game.scoreB());
        }

        @Test
        void should_return_empty_for_team_if_not_set() {
            // Given
            GameV1 game = gameBuilder().build();

            // Then
            assertThat(game.getPointsFor(oldTeamA)).isEmpty();
            assertThat(game.getPointsFor(oldTeamB)).isEmpty();
        }

    }

    @Nested
    @DisplayName("getPointsAgainst()")
    class GetPointsAgainst {

        @Test
        void should_return_score_for_team_if_set() {
            // Given
            GameV1 game = buildGame(oldTeamA, 18, oldTeamB, 12);

            // Then
            assertThat(game.getPointsAgainst(oldTeamA)).isPresent();
            assertThat(game.getPointsAgainst(oldTeamA)).isEqualTo(game.scoreB());
            assertThat(game.getPointsAgainst(oldTeamB)).isPresent();
            assertThat(game.getPointsAgainst(oldTeamB)).isEqualTo(game.scoreA());
        }

        @Test
        void should_return_empty_for_team_if_not_set() {
            // Given
            GameV1 game = gameBuilder().build();

            // Then
            assertThat(game.getPointsAgainst(oldTeamA)).isEmpty();
            assertThat(game.getPointsAgainst(oldTeamB)).isEmpty();
        }

    }
}
