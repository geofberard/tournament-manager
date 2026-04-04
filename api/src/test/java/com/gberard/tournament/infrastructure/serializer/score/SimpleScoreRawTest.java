package com.gberard.tournament.infrastructure.serializer.score;

import com.gberard.tournament.domain.model.Game;
import org.junit.jupiter.api.Test;

import static com.gberard.tournament.TestUtils.*;
import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;

class SimpleScoreRawTest {

    private static final com.gberard.tournament.domain.model.score.SimpleScore GAME_SCORE = buildSimpleScore(TEAM_A, 10, TEAM_B, 9);

    @Test
    void should_serialize_properly() {
        // Given
        Game game = gameBuilder().build();

        // When
        String serialized = DepthOneScoreRaw.serialize(GAME_SCORE, game.contestants());

        // Then
        assertThat(serialized).isEqualTo("10-9");
    }

    @Test
    void should_deserialize_properly() {
        // Given
        String serialized = "10-9";
        // When
        var score = DepthOneScoreRaw.deserialize(serialized, of(TEAM_A, TEAM_B));

        // Then
        assertThat(score.getPointFor(TEAM_A)).isEqualTo(10);
        assertThat(score.getPointFor(TEAM_B)).isEqualTo(9);
        assertThat(score).isEqualTo(GAME_SCORE);
    }


}
