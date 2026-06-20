package com.gberard.tournament.application.mapper;

import static com.gberard.tournament.TestUtils.*;
import static org.assertj.core.api.Assertions.assertThat;

import java.time.OffsetDateTime;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.gberard.tournament.generated.model.UpdateGameRequest;

class GameMapperTest {

    @Test
    void should_preserve_score_when_updating_game_with_same_contestants() {
        // GIVEN
        var existingGame = buildGame(TEAM_A, 12, TEAM_B, 9);
        var request = updateRequest(Set.of(TEAM_A.id(), TEAM_B.id()));

        // WHEN
        var updatedGame = GameMapper.toDomain(existingGame, request, PHASE_A, Set.of(TEAM_A, TEAM_B), Optional.empty());

        // THEN
        assertThat(updatedGame.score()).isEqualTo(existingGame.score());
        assertThat(updatedGame.time()).isEqualTo(request.getTime().toLocalDateTime());
    }

    @Test
    void should_remove_score_when_updating_game_with_different_contestants() {
        // GIVEN
        var existingGame = buildGame(TEAM_A, 12, TEAM_B, 9);
        var request = updateRequest(Set.of(TEAM_A.id(), TEAM_C.id()));

        // WHEN
        var updatedGame = GameMapper.toDomain(existingGame, request, PHASE_A, Set.of(TEAM_A, TEAM_C), Optional.empty());

        // THEN
        assertThat(updatedGame.score()).isEmpty();
    }

    private static UpdateGameRequest updateRequest(Set<String> contestantIds) {
        return new UpdateGameRequest()
                .phaseId(PHASE_A.id())
                .group("A")
                .time(OffsetDateTime.parse("2026-06-13T12:30:00Z"))
                .court("Court 2")
                .contestantIds(contestantIds);
    }
}
