package com.gberard.tournament.application.api;

import static com.gberard.tournament.TestUtils.PHASE_A;
import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.gameBuilder;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.OffsetDateTime;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.input.PhaseService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.generated.model.BulkGameChanges;
import com.gberard.tournament.generated.model.BulkUpdateGamesRequest;

import jakarta.persistence.EntityNotFoundException;

@ExtendWith(MockitoExtension.class)
class GamesApiDelegateImplTest {

    @InjectMocks
    private GamesApiDelegateImpl gamesApiDelegate;

    @Mock
    private GameService gameService;

    @Mock
    private TeamService teamService;

    @Mock
    private PhaseService phaseService;

    @Test
    void shouldApplyBulkChangesToEverySelectedGame() {
        // GIVEN
        Game firstGame = gameBuilder().id("game-1").court("Court 1").build();
        Game secondGame = gameBuilder().id("game-2").court("Court 2").build();
        OffsetDateTime newTime = OffsetDateTime.parse("2026-06-20T14:30:00Z");
        var request = new BulkUpdateGamesRequest(
                Set.of(firstGame.id(), secondGame.id()),
                new BulkGameChanges().court("Central").time(newTime)
        );
        when(gameService.findById(firstGame.id())).thenReturn(Optional.of(firstGame));
        when(gameService.findById(secondGame.id())).thenReturn(Optional.of(secondGame));
        when(gameService.update(any(Game.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        var response = gamesApiDelegate.bulkUpdateGames(request);

        // THEN
        var gameCaptor = ArgumentCaptor.forClass(Game.class);
        verify(gameService, org.mockito.Mockito.times(2)).update(gameCaptor.capture());
        assertThat(gameCaptor.getAllValues())
                .allSatisfy(game -> {
                    assertThat(game.court()).isEqualTo("Central");
                    assertThat(game.time()).isEqualTo(newTime.toLocalDateTime());
                    assertThat(game.group()).isEqualTo("A");
                });
        assertThat(response.getBody()).hasSize(2);
    }

    @Test
    void shouldResolveReferencesBeforeApplyingBulkChanges() {
        // GIVEN
        Game game = gameBuilder().id("game-1").build();
        var request = new BulkUpdateGamesRequest(
                Set.of(game.id()),
                new BulkGameChanges()
                        .phaseId(PHASE_A.id())
                        .refereeId(TEAM_A.id())
        );
        when(gameService.findById(game.id())).thenReturn(Optional.of(game));
        when(phaseService.findById(PHASE_A.id())).thenReturn(Optional.of(PHASE_A));
        when(teamService.findById(TEAM_A.id())).thenReturn(Optional.of(TEAM_A));
        when(gameService.update(any(Game.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        gamesApiDelegate.bulkUpdateGames(request);

        // THEN
        verify(phaseService).findById(PHASE_A.id());
        verify(teamService).findById(TEAM_A.id());
    }

    @Test
    void shouldNotUpdateAnyGameWhenASelectedGameDoesNotExist() {
        // GIVEN
        Game game = gameBuilder().id("game-1").build();
        var request = new BulkUpdateGamesRequest(
                new LinkedHashSet<>(List.of(game.id(), "unknown")),
                new BulkGameChanges().court("Central")
        );
        when(gameService.findById(game.id())).thenReturn(Optional.of(game));
        when(gameService.findById("unknown")).thenReturn(Optional.empty());

        // WHEN / THEN
        assertThatThrownBy(() -> gamesApiDelegate.bulkUpdateGames(request))
                .isInstanceOf(EntityNotFoundException.class);
        verify(gameService, never()).update(any());
    }

    @Test
    void shouldRejectBulkUpdateWithoutChanges() {
        // GIVEN
        var request = new BulkUpdateGamesRequest(Set.of("game-1"), new BulkGameChanges());

        // WHEN / THEN
        assertThatThrownBy(() -> gamesApiDelegate.bulkUpdateGames(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("At least one change is required");
        verify(gameService, never()).findById(any());
        verify(gameService, never()).update(any());
    }
}
