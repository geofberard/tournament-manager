package com.gberard.tournament.data.game.score;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.Game;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.data.game.ContestantResult.*;
import static org.assertj.core.api.Assertions.*;
import static org.assertj.core.api.Assertions.assertThat;

class GameScoreTest {

    @Nested
    @DisplayName("getPointsFor()")
    class GetPointsFor {

        @Test
        void should_return_score_for_team() {
            // Given
            GameScore score = buildGameScore(teamA, 18, teamB, 12);

            // Then
            assertThat(score.getPointFor(teamA.id())).isEqualTo(18);
            assertThat(score.getPointFor(teamB.id())).isEqualTo(12);
        }

    }

    @Nested
    @DisplayName("getPointsAgainst()")
    class GetPointsAgainst {

        @Test
        void should_return_score_against_team() {
            // Given
            GameScore score = buildGameScore(teamA, 18, teamB, 12);

            // Then
            assertThat(score.getPointAgainst(teamA.id())).isEqualTo(12);
            assertThat(score.getPointAgainst(teamB.id())).isEqualTo(18);
        }

    }

    @Nested
    @DisplayName("getContestantStatus()")
    class GetContestantStatusTest {

        @Test
        void should_handle_status_drawn() {
            // Given
            GameScore score = buildGameScore(teamA, 10, teamB, 10);

            // Then
            assertThat(score.getTeamStatus(teamA.id())).isEqualTo(DRAWN);
            assertThat(score.getTeamStatus(teamB.id())).isEqualTo(DRAWN);
        }

        public static Stream<Arguments> wonScenario() {
            return Stream.of(
                    Arguments.of("A win", buildGameScore(teamA, 10, teamB, 9), teamA),
                    Arguments.of("B win", buildGameScore(teamA, 14, teamB, 25), teamB)
            );
        }

        @ParameterizedTest
        @MethodSource("wonScenario")
        void should_handle_status_won(String scenario, Score score, Contestant winner) {
            assertThat(score.getTeamStatus(winner.id())).isEqualTo(WIN);
        }

        public static Stream<Arguments> lostScenario() {
            return Stream.of(
                    Arguments.of("A win", buildGameScore(teamA, 10, teamB, 9), teamB),
                    Arguments.of("B win", buildGameScore(teamA, 15, teamB, 25), teamA)
            );
        }

        @ParameterizedTest
        @MethodSource("lostScenario")
        void should_handle_status_lost(String scenario, Score score, Contestant loser) {
            assertThat(score.getTeamStatus(loser.id())).isEqualTo(LOST);
        }
    }

    @Nested
    @DisplayName("serialization")
    class serializationTest {

        public static final GameScore GAME_SCORE = buildGameScore(teamA, 10, teamB, 9);

        @Test
        void should_serialize_properly() throws JsonProcessingException {
            // When
            String serialized = new ObjectMapper().writeValueAsString(GAME_SCORE);

            // Then
            assertThat(serialized).contains("\"teamA\":10");
            assertThat(serialized).contains("\"teamB\":9");
        }

        public static Stream<Arguments> serializedScenario() {
            return Stream.of(
                    Arguments.of("{\"teamA\":10,\"teamB\":9}"),
                    Arguments.of("{\"teamB\":9,\"teamA\":10}")
            );
        }

        @ParameterizedTest
        @MethodSource("serializedScenario")
        void should_deserialize_properly(String serialized) throws JsonProcessingException {
            // When
            GameScore score = new ObjectMapper().readValue(serialized, GameScore.class);

            // Then
            assertThat(score.getPointFor(teamA.id())).isEqualTo(10);
            assertThat(score.getPointFor(teamB.id())).isEqualTo(9);
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