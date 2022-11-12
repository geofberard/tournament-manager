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
import static com.gberard.tournament.data.score.onelevel.OneLevelScore.createGameScore;
import static com.gberard.tournament.data.score.twolevel.TwoLevelScore.createSetScore;
import static java.nio.file.Files.readString;
import static org.assertj.core.api.Assertions.assertThat;

class GameIntegrationTest {


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

    public static Stream<Arguments> allGameScenario() {
        return Map.of(
                GAME_WITHOUT_SCORE, "game-with-no-score.json",
                GAME_WITH_ONE_ROUND, "game-with-one-level-score.json",
                GAME_WITH_MANY_ROUND, "game-with-two-level-score.json"
        ).entrySet().stream().map(entry -> Arguments.of(entry.getKey(), entry.getValue()));
    }

    @ParameterizedTest
    @MethodSource("allGameScenario")
    void should_deserialize_properly(Game game, String jsonFile) throws IOException, URISyntaxException {
        // Given
        String serialized = readString(Paths.get(GameIntegrationTest.class.getResource(jsonFile).toURI()));

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
