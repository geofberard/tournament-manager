package com.gberard.tournament.infrastructure.repository.jpa.model;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.PhaseType;
import com.gberard.tournament.domain.model.Team;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class GameEntityTest {

    @Test
    void shouldKeepPhaseWhenMappingGameToEntityAndBack() {
        // GIVEN
        Phase phase = new Phase("phase_1", "Brassage", "Matchs de poule", 1, PhaseType.POOL);
        Game game = new Game(
                null,
                phase,
                Optional.of("Ouverture"),
                "Poule A",
                LocalDateTime.of(2026, 6, 11, 18, 30),
                "Terrain 1",
                1000L,
                List.of(new Team("team_1", "Tigres"), new Team("team_2", "Lynx")),
                Optional.empty(),
                com.gberard.tournament.domain.model.GameStatus.SCHEDULED,
                Optional.empty()
        );

        // WHEN
        Game mappedGame = GameEntity.toDomain(GameEntity.toEntity(game));

        // THEN
        assertThat(mappedGame.phase()).isEqualTo(phase);
    }
}
