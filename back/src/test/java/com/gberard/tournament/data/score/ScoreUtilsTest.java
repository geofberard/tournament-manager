package com.gberard.tournament.data.score;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.util.Optional;

import static com.gberard.tournament.data._TestUtils.*;
import static org.assertj.core.api.Assertions.assertThat;

class ScoreUtilsTest {

    @BeforeAll
    static void beforeAll() {
        ScoreUtils.addSupportedScore(TestScore.class);
    }

    @Test
    void should_serialize_given_score() {
        // When
        Optional<Score> score = ScoreUtils.scoreFromJson(testScoreJson, TestScore.class.getSimpleName());

        // Then
        assertThat(score).isPresent()
                .get()
                .isEqualTo(testScore)
                .isExactlyInstanceOf(TestScore.class);
    }

    @Test
    void should_deserialize_given_json() {
        // When
        Optional<String> score = ScoreUtils.scoreToJson(testScore);

        // Then
        assertThat(score).isPresent()
                .get()
                .isEqualTo(testScoreJson);
    }

    @Test
    void should_give_classname_as_scoretype() {
        // When
        String score = ScoreUtils.getScoreType(testScore);

        // Then
        assertThat(score).isEqualTo("TestScore");
    }

}