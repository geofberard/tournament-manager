package com.gberard.tournament.infrastructure.serializer.score;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.score.SetScore;
import com.gberard.tournament.domain.model.score.Score;
import org.junit.jupiter.api.Test;

import static com.gberard.tournament.TestUtils.*;
import static com.gberard.tournament.domain.model.score.ScoreType.Set;
import static java.util.List.of;
import static org.assertj.core.api.Assertions.assertThat;

class SetScoreRawTest {

    public static final SetScore GAME_SCORE = buildSetScore(
            TEAM_A, of(18, 25, 12),
            TEAM_B, of(12, 14, 25)
    );

    @Test
    void should_serialize_properly() {
        // Given
        Game game = gameBuilder().scoreType(Set).build();

        // When
        String serialized = ScoreRaw.getScoreSerializer(game).apply(GAME_SCORE);

        // Then
        assertThat(serialized).isEqualTo("18-12;25-14;12-25");
    }

    @Test
    void should_deserialize_properly() {
        // Given
        String serialized = "18-12;25-14;12-25";

        // When
        Score score = ScoreRaw.getScoreDeserializer(of(TEAM_A, TEAM_B), Set).apply(serialized);

        // Then
        assertThat(score).isOfAnyClassIn(SetScore.class);
        assertThatScore(score, TEAM_A.id()).containsExactly(18, 25, 12);
        assertThatScore(score, TEAM_B.id()).containsExactly(12, 14, 25);
    }

}
