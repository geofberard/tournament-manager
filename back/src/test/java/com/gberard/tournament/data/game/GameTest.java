package com.gberard.tournament.data.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import static com.gberard.tournament.data._TestUtils.*;
import static com.gberard.tournament.data.score.game.GameScore.createGameScore;
import static com.gberard.tournament.data.score.set.SetScore.createSetScore;
import static java.nio.file.Files.readString;
import static org.assertj.core.api.Assertions.assertThat;

class GameTest {

    @Nested
    @DisplayName("isFinished()")
    class IsFinished {

        @Test
        void should_no_be_finished() {
            assertThat(game2.isFinished()).isFalse();
        }

        @Test
        void should_be_finished() {
            assertThat(buildGame(teamA, 10, teamB, 9).isFinished()).isTrue();
            assertThat(buildGame(teamA, 12, teamB, 12).isFinished()).isTrue();
            assertThat(buildGame(teamA, 15, teamB, 24).isFinished()).isTrue();
        }

    }

    @Nested
    @DisplayName("getScore()")
    class GetScoreTest {

        @Test
        void should_have_no_score_not_played() {
            assertThat(game2.score()).isEmpty();
        }

        @Test
        void should_have_score_when_played() {
            assertThat(buildGame(teamA, 10, teamB, 9).score()).isPresent();
            assertThat(buildGame(teamA, 12, teamB, 12).score()).isPresent();
            assertThat(buildGame(teamA, 15, teamB, 24).score()).isPresent();
        }

    }


    @Nested
    @DisplayName("serialization")
    class serializationTest {

        static final Game GAME_WITHOUT_SCORE = Game.builder()
                .id("noScore")
                .time(LocalDateTime.of(2022, 1, 1, 12, 12))
                .contestants(List.of(teamA, teamB))
                .court("court1")
                .build();

        static final Game GAME_WITH_ONE_ROUND = Game.builder()
                .id("oneRound")
                .time(LocalDateTime.of(2022, 1, 1, 12, 12))
                .contestants(List.of(teamA, teamB))
                .court("court1")
                .referee(teamC)
                .score(createGameScore(teamA, 10, teamB, 25))
                .build();

        static final Game GAME_WITH_MANY_ROUND = Game.builder()
                .id("threeRounds")
                .time(LocalDateTime.of(2022, 1, 1, 12, 12))
                .contestants(List.of(teamA, teamB))
                .court("court1")
                .referee(teamC)
                .score(createSetScore(teamA, List.of(10, 25, 16), teamB, List.of(25, 218, 25)))
                .build();

        static final Map<Game, String> serializedGames = Map.of(
                GAME_WITHOUT_SCORE, "match-without-score.json",
                GAME_WITH_ONE_ROUND, "match-with-game.json",
                GAME_WITH_MANY_ROUND, "match-with-set.json"
        );

        public static Stream<Arguments> fullGameScenario() {
            return Stream.of(GAME_WITH_ONE_ROUND, GAME_WITH_MANY_ROUND).map(Arguments::of);
        }

        @ParameterizedTest
        @MethodSource("fullGameScenario")
        void should_serialize_properly_full_games(Game game) throws JsonProcessingException {
            // When
            String serialized = new ObjectMapper().writeValueAsString(game);

            // Then
            assertThat(serialized).contains("\"id\":");
            assertThat(serialized).contains("\"time\":");
            assertThat(serialized).contains("\"court\":");
            assertThat(serialized).contains("\"contestants\":");
            assertThat(serialized).contains("\"referee\":");
            assertThat(serialized).contains("\"scoreType\":");
            assertThat(serialized).contains("\"score\":");
        }

        @Test
        void should_serialize_properly_empty_game() throws JsonProcessingException {
            // When
            String serialized = new ObjectMapper().writeValueAsString(GAME_WITHOUT_SCORE);

            // Then
            assertThat(serialized).contains("\"id\":");
            assertThat(serialized).contains("\"time\":");
            assertThat(serialized).contains("\"court\":");
            assertThat(serialized).contains("\"contestants\":");
            assertThat(serialized).doesNotContain("\"referee\":");
            assertThat(serialized).doesNotContain("\"scoreType\":");
            assertThat(serialized).doesNotContain("\"score\":");
        }

        public static Stream<Arguments> allGameScenario() {
            return Stream.of(GAME_WITHOUT_SCORE, GAME_WITH_ONE_ROUND, GAME_WITH_MANY_ROUND).map(Arguments::of);
        }

        @ParameterizedTest
        @MethodSource("allGameScenario")
        void should_deserialize_properly(Game game) throws IOException, URISyntaxException {
            // Given
            String serialized = readString(Paths.get(GameTest.class.getResource(serializedGames.get(game)).toURI()));

            // When
            Game deserializedGame = new ObjectMapper().readValue(serialized, Game.class);

            // Then
            assertThat(deserializedGame).isEqualTo(game);
        }

        @ParameterizedTest
        @MethodSource("allGameScenario")
        void should_serialize_and_deserialize_properly(Game game) throws JsonProcessingException {
            // Given
            String serialized = new ObjectMapper().writeValueAsString(game);

            // When
            Game deserializedGame = new ObjectMapper().readValue(serialized, Game.class);

            // Then
            assertThat(deserializedGame).isEqualTo(game);
        }


    }

}
