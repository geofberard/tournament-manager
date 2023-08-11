package com.gberard.tournament.data.score;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static com.gberard.tournament.TestUtils.*;
import static com.gberard.tournament.data.stats.ContestantResult.*;
import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;

class DepthTwoScoreTest {

    @Nested
    @DisplayName("getPointsFor()")
    class GetPointsFor {

        @Test
        void should_return_score_for_team() {
            // Given
            DepthTwoScore score = buildDepthTwoScore(TEAM_A, of(18, 25, 12), TEAM_B, of(12, 14, 25));

            // Then
            assertThat(score.getPointFor(TEAM_A)).isEqualTo(55);
            assertThat(score.getPointFor(TEAM_B)).isEqualTo(51);
        }

    }

    @Nested
    @DisplayName("getPointsAgainst()")
    class GetPointsAgainst {

        @Test
        void should_return_score_against_team() {
            // Given
            DepthTwoScore score = buildDepthTwoScore(TEAM_A, of(18, 25, 12), TEAM_B, of(12, 14, 25));

            // Then
            assertThat(score.getPointAgainst(TEAM_A)).isEqualTo(51);
            assertThat(score.getPointAgainst(TEAM_B)).isEqualTo(55);
        }

    }

    @Nested
    @DisplayName("getContestantStatus()")
    class GetContestantStatusTest {

        public static Stream<Arguments> drawnScenario() {
            return Stream.of(
                    Arguments.of("Perfect Tie", buildDepthTwoScore(TEAM_A, of(18, 12), TEAM_B, of(12, 25))),
                    Arguments.of("Drawn sets", buildDepthTwoScore(TEAM_A, of(15, 15), TEAM_B, of(15, 15))),
                    Arguments.of("Hybrid", buildDepthTwoScore(TEAM_A, of(18, 12, 15), TEAM_B, of(12, 25, 15)))
            );
        }

        @ParameterizedTest
        @MethodSource("drawnScenario")
        void should_handle_status_drawn(String scenario, Score score) {
            // Then
            assertThat(score.getTeamStatus(TEAM_A)).isEqualTo(DRAWN);
            assertThat(score.getTeamStatus(TEAM_B)).isEqualTo(DRAWN);
        }

        public static Stream<Arguments> wonScenario() {
            return Stream.of(
                    Arguments.of("A win", buildDepthTwoScore(TEAM_A, of(18, 25, 12), TEAM_B, of(12, 14, 12)), TEAM_A),
                    Arguments.of("A win with drawn", buildDepthTwoScore(TEAM_A, of(18, 25, 12), TEAM_B, of(12, 14, 25)), TEAM_A),
                    Arguments.of("B win", buildDepthTwoScore(TEAM_A, of(18, 25, 12), TEAM_B, of(25, 14, 25)), TEAM_B)
            );
        }

        @ParameterizedTest
        @MethodSource("wonScenario")
        void should_handle_status_won(String scenario, Score score, String winner) {
            assertThat(score.getTeamStatus(winner)).isEqualTo(WIN);
        }

        public static Stream<Arguments> lostScenario() {
            return Stream.of(
                    Arguments.of("A win", buildDepthTwoScore(TEAM_A, of(18, 25, 12), TEAM_B, of(12, 14, 12)), TEAM_B),
                    Arguments.of("A win with drawn", buildDepthTwoScore(TEAM_A, of(18, 25, 12), TEAM_B, of(12, 14, 25)), TEAM_B),
                    Arguments.of("B win", buildDepthTwoScore(TEAM_A, of(18, 25, 12), TEAM_B, of(25, 14, 25)), TEAM_A)
            );
        }

        @ParameterizedTest
        @MethodSource("lostScenario")
        void should_handle_status_lost(String scenario, Score score, String loser) {
            assertThat(score.getTeamStatus(loser)).isEqualTo(LOST);
        }
    }

}