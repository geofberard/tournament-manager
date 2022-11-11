package com.gberard.tournament.data.score.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.score.Score;
import com.gberard.tournament.data.score.game.GameScore;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.data.contestant.ContestantResult.*;
import static com.gberard.tournament.data.score.game.GameScore.createGameScore;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

class GameScoreTest {

    @Nested
    @DisplayName("getPointsFor()")
    class GetPointsFor {

        @Test
        void should_return_score_for_team() {
            // Given
            GameScore score = createGameScore(teamA, 18, teamB, 12);

            // Then
            assertThat(score.getPointFor(teamA)).isEqualTo(18);
            assertThat(score.getPointFor(teamB)).isEqualTo(12);
        }

        @Test
        void should_throw_exception_on_unknown_contestant() {
            // Given
            GameScore score = createGameScore(teamA, 18, teamB, 12);

            // Then
            IllegalStateException exception = assertThrows(
                    IllegalStateException.class,
                    () -> score.getPointFor(teamC),
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
            GameScore score = createGameScore(teamA, 18, teamB, 12);

            // Then
            assertThat(score.getPointAgainst(teamA)).isEqualTo(12);
            assertThat(score.getPointAgainst(teamB)).isEqualTo(18);
        }

        @Test
        void should_throw_exception_on_unknown_contestant() {
            // Given
            GameScore score = createGameScore(teamA, 18, teamB, 12);

            // Then
            IllegalStateException exception = assertThrows(
                    IllegalStateException.class,
                    () -> score.getPointAgainst(teamC),
                    "Expected merge() to throw, but it didn't"
            );
        }

    }

    @Nested
    @DisplayName("getContestantStatus()")
    class GetContestantStatusTest {

        @Test
        void should_handle_status_drawn() {
            // Given
            GameScore score = createGameScore(teamA, 10, teamB, 10);

            // Then
            assertThat(score.getTeamStatus(teamA)).isEqualTo(DRAWN);
            assertThat(score.getTeamStatus(teamB)).isEqualTo(DRAWN);
        }

        public static Stream<Arguments> wonScenario() {
            return Stream.of(
                    Arguments.of("A win", createGameScore(teamA, 10, teamB, 9), teamA),
                    Arguments.of("B win", createGameScore(teamA, 14, teamB, 25), teamB)
            );
        }

        @ParameterizedTest
        @MethodSource("wonScenario")
        void should_handle_status_won(String scenario, Score score, Contestant winner) {
            assertThat(score.getTeamStatus(winner)).isEqualTo(WIN);
        }

        public static Stream<Arguments> lostScenario() {
            return Stream.of(
                    Arguments.of("A win", createGameScore(teamA, 10, teamB, 9), teamB),
                    Arguments.of("B win", createGameScore(teamA, 15, teamB, 25), teamA)
            );
        }

        @ParameterizedTest
        @MethodSource("lostScenario")
        void should_handle_status_lost(String scenario, Score score, Contestant loser) {
            assertThat(score.getTeamStatus(loser)).isEqualTo(LOST);
        }

        @Test
        void should_throw_exception_on_unknown_contestant() {
            // Given
            GameScore score = createGameScore(teamA, 18, teamB, 12);

            // Then
            IllegalStateException exception = assertThrows(
                    IllegalStateException.class,
                    () -> score.getTeamStatus(teamC),
                    "Expected merge() to throw, but it didn't"
            );
        }
    }

    @Nested
    @DisplayName("serialization")
    class serializationTest {

        public static final GameScore GAME_SCORE = createGameScore(teamA, 10, teamB, 9);

        @Test
        void should_serialize_properly() throws JsonProcessingException {
            // When
            String serialized = new ObjectMapper().writeValueAsString(GAME_SCORE);

            // Then
            assertThat(serialized).contains("\"teamA\":10");
            assertThat(serialized).contains("\"teamB\":9");
        }

        public static Stream<Arguments> serializedScenario() {
            return Stream.of("{\"teamA\":10,\"teamB\":9}","{\"teamB\":9,\"teamA\":10}").map(Arguments::of);
        }

        @ParameterizedTest
        @MethodSource("serializedScenario")
        void should_deserialize_properly(String serialized) throws JsonProcessingException {
            // When
            GameScore score = new ObjectMapper().readValue(serialized, GameScore.class);

            // Then
            assertThat(score.getPointFor(teamA)).isEqualTo(10);
            assertThat(score.getPointFor(teamB)).isEqualTo(9);
            assertThat(score).isEqualTo(GAME_SCORE);
        }

        @Test
        void should_serialize_and_deserialize_properly() throws JsonProcessingException {
            // Given
            String serialized = new ObjectMapper().writeValueAsString(GAME_SCORE);

            // When
            GameScore score = new ObjectMapper().readValue(serialized, GameScore.class);

            // Then
            assertThat(score).isEqualTo(GAME_SCORE);
        }


    }

}