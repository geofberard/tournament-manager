package com.gberard.tournament.application.api;

import static com.gberard.tournament.TestUtils.PHASE_A;
import static com.gberard.tournament.TestUtils.TEAM_A;
import static com.gberard.tournament.TestUtils.TEAM_B;
import static com.gberard.tournament.TestUtils.TEAM_C;
import static com.gberard.tournament.TestUtils.gameBuilder;
import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.LocalDateTime;
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
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.PhaseType;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.input.PhaseService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.service.PoolGamePlanningService;
import com.gberard.tournament.generated.model.BulkCreateGamesRequest;
import com.gberard.tournament.generated.model.BulkGameChanges;
import com.gberard.tournament.generated.model.BulkUpdateGamesRequest;
import com.gberard.tournament.generated.model.CreateGameRequest;

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

    @Mock
    private PoolGamePlanningService poolGamePlanningService;

    @Test
    void shouldCreateEveryPlannedGameForAPool() {
        // GIVEN
        var request = bulkCreateRequest(true, TEAM_A.id(), TEAM_B.id(), TEAM_C.id());
        Game firstGame = gameBuilder()
                .id("game-1")
                .contestants(List.of(TEAM_A, TEAM_B))
                .refereeId(TEAM_C)
                .build();
        Game secondGame = gameBuilder()
                .id("game-2")
                .contestants(List.of(TEAM_A, TEAM_C))
                .refereeId(TEAM_B)
                .build();
        when(phaseService.findById(PHASE_A.id())).thenReturn(Optional.of(PHASE_A));
        when(gameService.findByPhase(PHASE_A)).thenReturn(List.of());
        when(teamService.findById(TEAM_A.id())).thenReturn(Optional.of(TEAM_A));
        when(teamService.findById(TEAM_B.id())).thenReturn(Optional.of(TEAM_B));
        when(teamService.findById(TEAM_C.id())).thenReturn(Optional.of(TEAM_C));
        when(poolGamePlanningService.plan(
                eq(PHASE_A),
                eq(List.of(TEAM_A, TEAM_B, TEAM_C)),
                eq(LocalDateTime.parse("2026-06-20T09:00:00")),
                eq(Duration.ofMinutes(12)),
                eq(Duration.ofMinutes(3)),
                eq("Terrain 1"),
                eq(true)
        )).thenReturn(List.of(firstGame, secondGame));
        when(gameService.create(any(Game.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        var response = gamesApiDelegate.bulkCreateGames(request);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).extracting(com.gberard.tournament.generated.model.Game::getId)
                .containsExactly("game-1", "game-2");
        verify(gameService, times(2)).create(any(Game.class));
    }

    @Test
    void shouldRejectBulkCreationForABracketPhase() {
        // GIVEN
        Phase bracket = new Phase("phase-bracket", "Finales", null, 2, PhaseType.BRACKET);
        var request = bulkCreateRequest(false, TEAM_A.id(), TEAM_B.id());
        request.setPhaseId(bracket.id());
        when(phaseService.findById(bracket.id())).thenReturn(Optional.of(bracket));

        // WHEN / THEN
        assertThatThrownBy(() -> gamesApiDelegate.bulkCreateGames(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Games can only be generated for a pool phase");
        verify(gameService, never()).create(any());
    }

    @Test
    void shouldRejectBulkCreationForAnUntypedChildOfAPoolPhase() {
        Phase pool = new Phase("pool", "Poules principales", null, 1, PhaseType.POOL);
        Phase childPhase = new Phase(
                "pool-a",
                Optional.of(pool.id()),
                "Poule A",
                null,
                1,
                Optional.empty());
        var request = bulkCreateRequest(false, TEAM_A.id(), TEAM_B.id());
        request.setPhaseId(childPhase.id());
        when(phaseService.findById(childPhase.id())).thenReturn(Optional.of(childPhase));

        assertThatThrownBy(() -> gamesApiDelegate.bulkCreateGames(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Games can only be generated for a pool phase");
        verify(phaseService, never()).findById(pool.id());
        verify(gameService, never()).create(any());
    }

    @Test
    void shouldRejectBulkCreationWhenThePhaseAlreadyContainsGames() {
        // GIVEN
        var request = bulkCreateRequest(false, TEAM_A.id(), TEAM_B.id());
        when(phaseService.findById(PHASE_A.id())).thenReturn(Optional.of(PHASE_A));
        when(gameService.findByPhase(PHASE_A))
                .thenReturn(List.of(gameBuilder().build()));

        // WHEN / THEN
        assertThatThrownBy(() -> gamesApiDelegate.bulkCreateGames(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("already contains games");
        verify(teamService, never()).findById(any());
        verify(gameService, never()).create(any());
    }

    @Test
    void shouldRejectTeamRefereesWhenThePoolHasOnlyTwoTeams() {
        // GIVEN
        var request = bulkCreateRequest(true, TEAM_A.id(), TEAM_B.id());
        when(phaseService.findById(PHASE_A.id())).thenReturn(Optional.of(PHASE_A));

        // WHEN / THEN
        assertThatThrownBy(() -> gamesApiDelegate.bulkCreateGames(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("At least three teams");
        verify(gameService, never()).create(any());
    }

    @Test
    void shouldCreateEveryPlannedGameWithoutTimeForAPool() {
        // GIVEN
        var request = bulkCreateRequestWithoutTime(false, TEAM_A.id(), TEAM_B.id());
        Game plannedGame = gameBuilder()
                .id("game-1")
                .time(null)
                .contestants(List.of(TEAM_A, TEAM_B))
                .build();
        when(phaseService.findById(PHASE_A.id())).thenReturn(Optional.of(PHASE_A));
        when(gameService.findByPhase(PHASE_A)).thenReturn(List.of());
        when(teamService.findById(TEAM_A.id())).thenReturn(Optional.of(TEAM_A));
        when(teamService.findById(TEAM_B.id())).thenReturn(Optional.of(TEAM_B));
        when(poolGamePlanningService.plan(
                eq(PHASE_A),
                eq(List.of(TEAM_A, TEAM_B)),
                eq(null),
                eq(null),
                eq(null),
                eq("Terrain 1"),
                eq(false)
        )).thenReturn(List.of(plannedGame));
        when(gameService.create(any(Game.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        var response = gamesApiDelegate.bulkCreateGames(request);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).extracting(com.gberard.tournament.generated.model.Game::getTime)
                .containsExactly((OffsetDateTime) null);
    }

    @Test
    void shouldNotCreateAnyGameWhenATeamDoesNotExist() {
        // GIVEN
        var request = bulkCreateRequest(false, TEAM_A.id(), "unknown");
        when(phaseService.findById(PHASE_A.id())).thenReturn(Optional.of(PHASE_A));
        when(gameService.findByPhase(PHASE_A)).thenReturn(List.of());
        when(teamService.findById(TEAM_A.id())).thenReturn(Optional.of(TEAM_A));
        when(teamService.findById("unknown")).thenReturn(Optional.empty());

        // WHEN / THEN
        assertThatThrownBy(() -> gamesApiDelegate.bulkCreateGames(request))
                .isInstanceOf(EntityNotFoundException.class)
                .hasMessage("Unknown team unknown");
        verify(poolGamePlanningService, never()).plan(
                any(), any(), any(), any(), any(), any(), anyBoolean()
        );
        verify(gameService, never()).create(any());
    }

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
                });
        assertThat(response.getBody()).hasSize(2);
    }

    @Test
    void shouldClearTimeWhenBulkUpdatingSelectedGames() {
        // GIVEN
        Game game = gameBuilder()
                .id("game-1")
                .time(LocalDateTime.parse("2026-06-20T14:30:00"))
                .build();
        var request = new BulkUpdateGamesRequest(
                Set.of(game.id()),
                new BulkGameChanges().clearTime(true)
        );
        when(gameService.findById(game.id())).thenReturn(Optional.of(game));
        when(gameService.update(any(Game.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        gamesApiDelegate.bulkUpdateGames(request);

        // THEN
        var gameCaptor = ArgumentCaptor.forClass(Game.class);
        verify(gameService).update(gameCaptor.capture());
        assertThat(gameCaptor.getValue().time()).isNull();
    }

    @Test
    void shouldShiftEverySelectedGameByTheRequestedNumberOfMinutes() {
        // GIVEN
        Game firstGame = gameBuilder()
                .id("game-1")
                .time(LocalDateTime.parse("2026-06-20T14:30:00"))
                .build();
        Game secondGame = gameBuilder()
                .id("game-2")
                .time(LocalDateTime.parse("2026-06-20T16:00:00"))
                .build();
        var request = new BulkUpdateGamesRequest(
                Set.of(firstGame.id(), secondGame.id()),
                new BulkGameChanges().timeOffsetMinutes(-15)
        );
        when(gameService.findById(firstGame.id())).thenReturn(Optional.of(firstGame));
        when(gameService.findById(secondGame.id())).thenReturn(Optional.of(secondGame));
        when(gameService.update(any(Game.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        gamesApiDelegate.bulkUpdateGames(request);

        // THEN
        var gameCaptor = ArgumentCaptor.forClass(Game.class);
        verify(gameService, org.mockito.Mockito.times(2)).update(gameCaptor.capture());
        assertThat(gameCaptor.getAllValues())
                .extracting(Game::time)
                .containsExactlyInAnyOrder(
                        LocalDateTime.parse("2026-06-20T14:15:00"),
                        LocalDateTime.parse("2026-06-20T15:45:00")
                );
    }

    @Test
    void shouldRejectAnAbsoluteTimeCombinedWithATimeOffset() {
        // GIVEN
        var request = new BulkUpdateGamesRequest(
                Set.of("game-1"),
                new BulkGameChanges()
                        .time(OffsetDateTime.parse("2026-06-20T14:30:00Z"))
                        .timeOffsetMinutes(15)
        );

        // WHEN / THEN
        assertThatThrownBy(() -> gamesApiDelegate.bulkUpdateGames(request))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("time and timeOffsetMinutes cannot be used together");
        verify(gameService, never()).findById(any());
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
    void shouldCreateGameWithoutTime() {
        // GIVEN
        var request = new CreateGameRequest()
                .phaseId(PHASE_A.id())
                .time(null)
                .court("Terrain 1")
                .contestantIds(Set.of(TEAM_A.id(), TEAM_B.id()));
        when(teamService.findById(TEAM_A.id())).thenReturn(Optional.of(TEAM_A));
        when(teamService.findById(TEAM_B.id())).thenReturn(Optional.of(TEAM_B));
        when(phaseService.findById(PHASE_A.id())).thenReturn(Optional.of(PHASE_A));
        when(gameService.create(any(Game.class))).thenAnswer(invocation -> invocation.getArgument(0));

        // WHEN
        var response = gamesApiDelegate.createGame(request);

        // THEN
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody().getTime()).isNull();
    }

    @Test
    void shouldExposeTheCompletePhasePathFromRootToCurrentPhase() {
        Phase root = new Phase("root", "Tournoi", null, 1, PhaseType.POOL);
        Phase child = new Phase(
                "child",
                Optional.of(root.id()),
                "Finale",
                null,
                1,
                Optional.empty());
        Game game = gameBuilder().phasePath(List.of(root, child)).build();
        when(gameService.findById(game.id())).thenReturn(Optional.of(game));

        var response = gamesApiDelegate.getGameById(game.id());

        assertThat(response.getBody().getPhasePath())
                .extracting(com.gberard.tournament.generated.model.Phase::getId)
                .containsExactly(root.id(), child.id());
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

    private BulkCreateGamesRequest bulkCreateRequest(boolean assignReferees, String... teamIds) {
        return bulkCreateRequestWithoutTime(assignReferees, teamIds)
                .startTime(OffsetDateTime.parse("2026-06-20T11:00:00+02:00"))
                .gameDurationMinutes(12)
                .breakDurationMinutes(3);
    }

    private BulkCreateGamesRequest bulkCreateRequestWithoutTime(boolean assignReferees, String... teamIds) {
        return new BulkCreateGamesRequest(
                PHASE_A.id(),
                "Terrain 1",
                new LinkedHashSet<>(List.of(teamIds)),
                assignReferees
        );
    }
}
