package com.gberard.tournament.data.game;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.Game;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static com.gberard.tournament.data.game.ContestantResult.*;
import static com.gberard.tournament.data._TestUtils.*;
import static org.assertj.core.api.Assertions.assertThat;

class GameTest {

    @Nested
    @DisplayName("isFinished()")
    class IsFinished {

        @Test
        void should_no_be_finished() {
            assertThat(gameBuilder().build().isFinished()).isFalse();
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
            assertThat(gameBuilder().build().score()).isEmpty();
        }

        @Test
        void should_have_score_when_played() {
            assertThat(buildGame(teamA, 10, teamB, 9).score()).isPresent();
            assertThat(buildGame(teamA, 12, teamB, 12).score()).isPresent();
            assertThat(buildGame(teamA, 15, teamB, 24).score()).isPresent();
        }

    }

}
