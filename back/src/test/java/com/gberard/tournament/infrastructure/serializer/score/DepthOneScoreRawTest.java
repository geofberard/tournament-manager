package com.gberard.tournament.infrastructure.serializer.score;

import com.gberard.tournament.domain.client.Game;
import com.gberard.tournament.domain.score.DepthOneScore;
import com.gberard.tournament.domain.score.Score;
import org.junit.jupiter.api.Test;

import static com.gberard.tournament.TestUtils.*;
import static com.gberard.tournament.domain.score.ScoreType.DepthOne;
import static com.gberard.tournament.infrastructure.serializer.score.ScoreRaw.getScoreDeserializer;
import static com.gberard.tournament.infrastructure.serializer.score.ScoreRaw.getScoreSerializer;
import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;

class DepthOneScoreRawTest {

    private static final DepthOneScore GAME_SCORE = buildDepthOneScore(TEAM_A, 10, TEAM_B, 9);

    @Test
    void should_serialize_properly() {
        // Given
        Game game = gameBuilder().scoreType(DepthOne).build();

        // When
        String serialized = getScoreSerializer(game).apply(GAME_SCORE);

        // Then
        assertThat(serialized).isEqualTo("10-9");
    }

    @Test
    void should_deserialize_properly() {
        // Given
        String serialized = "10-9";
        // When
        Score score = getScoreDeserializer(of(TEAM_A, TEAM_B), DepthOne).apply(serialized);

        // Then
        assertThat(score).isOfAnyClassIn(DepthOneScore.class);
        assertThat(score.getPointFor(TEAM_A)).isEqualTo(10);
        assertThat(score.getPointFor(TEAM_B)).isEqualTo(9);
        assertThat(score).isEqualTo(GAME_SCORE);
    }


}
