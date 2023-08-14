package com.gberard.tournament.serializer.score;

import com.gberard.tournament.data.client.Game;
import com.gberard.tournament.data.score.DepthTwoScore;
import com.gberard.tournament.data.score.Score;
import org.junit.jupiter.api.Test;

import static com.gberard.tournament.TestUtils.*;
import static com.gberard.tournament.data.score.ScoreType.DepthTwo;
import static com.gberard.tournament.serializer.score.ScoreRaw.getScoreDeserializer;
import static com.gberard.tournament.serializer.score.ScoreRaw.getScoreSerializer;
import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;

class DepthTwoScoreRawTest {

    public static final DepthTwoScore GAME_SCORE = buildDepthTwoScore(
            TEAM_A, of(18, 25, 12),
            TEAM_B, of(12, 14, 25)
    );

    @Test
    void should_serialize_properly() {
        // Given
        Game game = gameBuilder().scoreType(DepthTwo).build();

        // When
        String serialized = getScoreSerializer(game).apply(GAME_SCORE);

        // Then
        assertThat(serialized).isEqualTo("18-12;25-14;12-25");
    }

    @Test
    void should_deserialize_properly() {
        // Given
        String serialized = "18-12;25-14;12-25";

        // When
        Score score = getScoreDeserializer(of(TEAM_A, TEAM_B), DepthTwo).apply(serialized);

        // Then
        assertThat(score).isOfAnyClassIn(DepthTwoScore.class);
        assertThatScore(score, TEAM_A).containsExactly(18, 25, 12);
        assertThatScore(score, TEAM_B).containsExactly(12, 14, 25);
    }

}