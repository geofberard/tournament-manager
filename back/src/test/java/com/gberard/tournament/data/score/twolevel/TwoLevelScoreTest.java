package com.gberard.tournament.data.score.twolevel;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.score.Score;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.data.contestant.ContestantResult.*;
import static com.gberard.tournament.data.score.twolevel.TwoLevelScore.createSetScore;
import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;

class TwoLevelScoreTest {

    @Nested
    @DisplayName("getPointsFor()")
    class GetPointsFor {

        @Test
        void should_return_score_for_team() {
            // Given
            TwoLevelScore score = createSetScore(teamA, of(18, 25, 12), teamB, of(12, 14, 25));

            // Then
            assertThat(score.getPointFor(teamA)).isEqualTo(55);
            assertThat(score.getPointFor(teamB)).isEqualTo(51);
        }

    }

    @Nested
    @DisplayName("getPointsAgainst()")
    class GetPointsAgainst {

        @Test
        void should_return_score_against_team() {
            // Given
            TwoLevelScore score = createSetScore(teamA, of(18, 25, 12), teamB, of(12, 14, 25));

            // Then
            assertThat(score.getPointAgainst(teamA)).isEqualTo(51);
            assertThat(score.getPointAgainst(teamB)).isEqualTo(55);
        }

    }

    @Nested
    @DisplayName("getContestantStatus()")
    class GetContestantStatusTest {

        public static Stream<Arguments> drawnScenario() {
            return Stream.of(
                    Arguments.of("Perfect Tie", createSetScore(teamA, of(18, 12), teamB, of(12, 25))),
                    Arguments.of("Drawn sets", createSetScore(teamA, of(15, 15), teamB, of(15, 15))),
                    Arguments.of("Hybrid", createSetScore(teamA, of(18, 12, 15), teamB, of(12, 25, 15)))
            );
        }

        @ParameterizedTest
        @MethodSource("drawnScenario")
        void should_handle_status_drawn(String scenario, Score score) {
            // Then
            assertThat(score.getTeamStatus(teamA)).isEqualTo(DRAWN);
            assertThat(score.getTeamStatus(teamB)).isEqualTo(DRAWN);
        }

        public static Stream<Arguments> wonScenario() {
            return Stream.of(
                    Arguments.of("A win", createSetScore(teamA, of(18, 25, 12), teamB, of(12, 14, 12)), teamA),
                    Arguments.of("A win with drawn", createSetScore(teamA, of(18, 25, 12), teamB, of(12, 14, 25)), teamA),
                    Arguments.of("B win", createSetScore(teamA, of(18, 25, 12), teamB, of(25, 14, 25)), teamB)
            );
        }

        @ParameterizedTest
        @MethodSource("wonScenario")
        void should_handle_status_won(String scenario, Score score, Contestant winner) {
            assertThat(score.getTeamStatus(winner)).isEqualTo(WIN);
        }

        public static Stream<Arguments> lostScenario() {
            return Stream.of(
                    Arguments.of("A win", createSetScore(teamA, of(18, 25, 12), teamB, of(12, 14, 12)), teamB),
                    Arguments.of("A win with drawn", createSetScore(teamA, of(18, 25, 12), teamB, of(12, 14, 25)), teamB),
                    Arguments.of("B win", createSetScore(teamA, of(18, 25, 12), teamB, of(25, 14, 25)), teamA)
            );
        }

        @ParameterizedTest
        @MethodSource("lostScenario")
        void should_handle_status_lost(String scenario, Score score, Contestant loser) {
            assertThat(score.getTeamStatus(loser)).isEqualTo(LOST);
        }
    }

    @Nested
    @DisplayName("serialization")
    class serializationTest {

        public static final TwoLevelScore SET_SCORE = createSetScore(teamA, of(18, 25, 12), teamB, of(12, 14, 25));

        @Test
        void should_serialize_properly() throws JsonProcessingException {
            // When
            String serialized = new ObjectMapper().writeValueAsString(SET_SCORE);

            // Then
            String[] gameSplit = serialized.split("\\},\\{");
            assertThat(gameSplit).hasSize(3);
            assertThat(gameSplit[0]).contains("\"teamA\":18");
            assertThat(gameSplit[0]).contains("\"teamB\":12");
            assertThat(gameSplit[1]).contains("\"teamA\":25");
            assertThat(gameSplit[1]).contains("\"teamB\":14");
            assertThat(gameSplit[2]).contains("\"teamA\":12");
            assertThat(gameSplit[2]).contains("\"teamB\":25");
            System.out.println(serialized);
        }

        public static Stream<Arguments> serializedScenario() {
            return Stream.of(
                    Arguments.of("[{\"teamB\":12,\"teamA\":18},{\"teamB\":14,\"teamA\":25},{\"teamB\":25,\"teamA\":12}]"),
                    Arguments.of("[{\"teamA\":18,\"teamB\":12},{\"teamB\":14,\"teamA\":25},{\"teamA\":12,\"teamB\":25}]")
            );
        }

        @ParameterizedTest
        @MethodSource("serializedScenario")
        void should_deserialize_properly(String serialized) throws JsonProcessingException {
            // When
            TwoLevelScore score = new ObjectMapper().readValue(serialized, TwoLevelScore.class);

            // Then
            assertThat(score.getResult().get(0).getPointFor(teamA)).isEqualTo(18);
            assertThat(score.getResult().get(0).getPointFor(teamB)).isEqualTo(12);
            assertThat(score.getResult().get(1).getPointFor(teamA)).isEqualTo(25);
            assertThat(score.getResult().get(1).getPointFor(teamB)).isEqualTo(14);
            assertThat(score.getResult().get(2).getPointFor(teamA)).isEqualTo(12);
            assertThat(score.getResult().get(2).getPointFor(teamB)).isEqualTo(25);
            assertThat(score).isEqualTo(SET_SCORE);
        }

        @Test
        void should_serialize_and_deserialize_properly() throws JsonProcessingException {
            // Given
            String serialized = new ObjectMapper().writeValueAsString(SET_SCORE);

            // When
            TwoLevelScore score = new ObjectMapper().readValue(serialized, TwoLevelScore.class);

            // Then
            assertThat(score).isEqualTo(SET_SCORE);
        }


    }

}