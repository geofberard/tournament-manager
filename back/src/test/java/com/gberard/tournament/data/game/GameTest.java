package com.gberard.tournament.data.game;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.gberard.tournament.data.score.ScoreUtils;
import org.junit.jupiter.api.BeforeAll;
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
import static java.nio.file.Files.readString;
import static org.assertj.core.api.Assertions.assertThat;

class GameTest {

    @BeforeAll
    static void beforeAll() {
        ScoreUtils.addSupportedScore(TestScore.class);
    }

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

        public static final Game GAME_WITH_TEST_SCORE = Game.builder()
                .id("oneRound")
                .time(LocalDateTime.of(2022, 1, 1, 12, 12))
                .contestants(List.of(teamA, teamB))
                .court("court1")
                .referee(teamC)
                .score(testScore)
                .build();

        public static final Game GAME_WITH_NO_SCORE = Game.builder()
                .id("noScore")
                .time(LocalDateTime.of(2022, 1, 1, 12, 12))
                .contestants(List.of(teamA, teamB))
                .court("court1")
                .build();

        @Test
        void should_serialize_properly_full_games() throws JsonProcessingException {
            // When
            String serialized = new ObjectMapper().writeValueAsString(GAME_WITH_TEST_SCORE);

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
            String serialized = new ObjectMapper().writeValueAsString(GAME_WITH_NO_SCORE);

            // Then
            assertThat(serialized).contains("\"id\":");
            assertThat(serialized).contains("\"time\":");
            assertThat(serialized).contains("\"court\":");
            assertThat(serialized).contains("\"contestants\":");
            assertThat(serialized).doesNotContain("\"referee\":");
            assertThat(serialized).doesNotContain("\"scoreType\":");
            assertThat(serialized).doesNotContain("\"score\":");
        }

        public static Stream<Arguments> allGames() {
            return Stream.of(GAME_WITH_NO_SCORE, GAME_WITH_TEST_SCORE).map(Arguments::of);
        }

        @ParameterizedTest
        @MethodSource("allGames")
        void should_serialize_and_deserialize_properly(Game game) throws JsonProcessingException {
            // Given
            String serialized = new ObjectMapper().writeValueAsString(game);

            // When
            Game deserializedGame = new ObjectMapper().readValue(serialized, Game.class);

            // Then
            assertThat(deserializedGame).isEqualTo(game);
        }

        public static Stream<Arguments> allJsonFiles() {
            return Stream.of("game-with-no-score.json", "game-with-test-score.json").map(Arguments::of);
        }

        @ParameterizedTest
        @MethodSource("allJsonFiles")
        void should_deserialize_and_serialize_properly(String gameJson) throws IOException, URISyntaxException {
            // Given
            String serialized = readString(Paths.get(GameIntegrationTest.class.getResource(gameJson).toURI()));
            Game deserializedGame = new ObjectMapper().readValue(serialized, Game.class);

            // When
            String reserialized = new ObjectMapper().writeValueAsString(deserializedGame);

            // Then
            assertThat(reserialized).isEqualTo(serialized.replace("\n", "").replace(" ", ""));
        }

    }

}
