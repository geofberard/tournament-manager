package com.gberard.tournament.infrastructure.serializer.score;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.score.Score;
import org.junit.jupiter.api.Test;

import static com.gberard.tournament.TestUtils.*;
import static com.gberard.tournament.domain.model.score.ScoreType.Simple;
import static com.gberard.tournament.infrastructure.serializer.score.ScoreRaw.getScoreDeserializer;
import static com.gberard.tournament.infrastructure.serializer.score.ScoreRaw.getScoreSerializer;
import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;

class SimpleScoreRawTest {

    private static final com.gberard.tournament.domain.model.score.SimpleScore GAME_SCORE = buildSimpleScore(TEAM_A, 10, TEAM_B, 9);

    @Test
    void should_serialize_properly() {
        // Given
        Game game = gameBuilder().scoreType(Simple).build();

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
        Score score = getScoreDeserializer(of(TEAM_A, TEAM_B), Simple).apply(serialized);

        // Then
        assertThat(score).isOfAnyClassIn(com.gberard.tournament.domain.model.score.SimpleScore.class);
        assertThat(score.getPointFor(TEAM_A)).isEqualTo(10);
        assertThat(score.getPointFor(TEAM_B)).isEqualTo(9);
        assertThat(score).isEqualTo(GAME_SCORE);
    }


}
