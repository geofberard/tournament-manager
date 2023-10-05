package com.gberard.tournament.domain.score;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static com.gberard.tournament.TestUtils.*;
import static com.gberard.tournament.domain.stats.ContestantResult.*;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class DepthOneScoreTest {

    @Nested
    @DisplayName("getPointsFor()")
    class GetPointsFor {

        @Test
        void should_return_score_for_team() {
            // Given
            DepthOneScore score = buildDepthOneScore(TEAM_A, 18, TEAM_B, 12);

            // Then
            assertThat(score.getPointFor(TEAM_A)).isEqualTo(18);
            assertThat(score.getPointFor(TEAM_B)).isEqualTo(12);
        }

        @Test
        void should_throw_exception_on_unknown_contestant() {
            // Given
            DepthOneScore score = buildDepthOneScore(TEAM_A, 18, TEAM_B, 12);

            // Then
            IllegalStateException exception = assertThrows(
                    IllegalStateException.class,
                    () -> score.getPointFor(TEAM_C),
                    "Expected merge() to throw, but it didn't"
            );
        }

    }

    @Nested
    @DisplayName("getPointsAgainst()")
    class GetPointsAgainst {

        @Test
        void should_return_score_against_team() {
            // Given
            DepthOneScore score = buildDepthOneScore(TEAM_A, 18, TEAM_B, 12);

            // Then
            assertThat(score.getPointAgainst(TEAM_A)).isEqualTo(12);
            assertThat(score.getPointAgainst(TEAM_B)).isEqualTo(18);
        }

        @Test
        void should_throw_exception_on_unknown_contestant() {
            // Given
            DepthOneScore score = buildDepthOneScore(TEAM_A, 18, TEAM_B, 12);

            // Then
            IllegalStateException exception = assertThrows(
                    IllegalStateException.class,
                    () -> score.getPointAgainst(TEAM_C),
                    "Expected merge() to throw, but it didn't"
            );
        }

    }

    @Nested
    @DisplayName("getContestantStatus()")
    class GetContestantStatusTest {

        public static Stream<Arguments> wonScenario() {
            return Stream.of(
                    Arguments.of("A win", buildDepthOneScore(TEAM_A, 10, TEAM_B, 9), TEAM_A),
                    Arguments.of("B win", buildDepthOneScore(TEAM_A, 14, TEAM_B, 25), TEAM_B)
            );
        }

        public static Stream<Arguments> lostScenario() {
            return Stream.of(
                    Arguments.of("A win", buildDepthOneScore(TEAM_A, 10, TEAM_B, 9), TEAM_B),
                    Arguments.of("B win", buildDepthOneScore(TEAM_A, 15, TEAM_B, 25), TEAM_A)
            );
        }

        @Test
        void should_handle_status_drawn() {
            // Given
            DepthOneScore score = buildDepthOneScore(TEAM_A, 10, TEAM_B, 10);

            // Then
            assertThat(score.getTeamStatus(TEAM_A)).isEqualTo(DRAWN);
            assertThat(score.getTeamStatus(TEAM_B)).isEqualTo(DRAWN);
        }

        @ParameterizedTest
        @MethodSource("wonScenario")
        void should_handle_status_won(String scenario, Score score, String winner) {
            assertThat(score.getTeamStatus(winner)).isEqualTo(WIN);
        }

        @ParameterizedTest
        @MethodSource("lostScenario")
        void should_handle_status_lost(String scenario, Score score, String loser) {
            assertThat(score.getTeamStatus(loser)).isEqualTo(LOST);
        }

        @Test
        void should_throw_exception_on_unknown_contestant() {
            // Given
            DepthOneScore score = buildDepthOneScore(TEAM_A, 18, TEAM_B, 12);

            // Then
            IllegalStateException exception = assertThrows(
                    IllegalStateException.class,
                    () -> score.getTeamStatus(TEAM_C),
                    "Expected merge() to throw, but it didn't"
            );
        }
    }

}