package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.exception.TeamInUseException;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.domain.port.output.TeamRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TeamServiceImplTest {

    private static final Team TEAM = new Team("team_1", "Aigles");

    @InjectMocks
    private TeamServiceImpl teamService;

    @Mock
    private TeamRepository teamRepository;

    @Mock
    private GameRepository gameRepository;

    @Test
    void shouldDeleteTeamWhenItDoesNotParticipateInAnyGame() {
        // GIVEN
        when(gameRepository.existsByTeamId(TEAM.id())).thenReturn(false);

        // WHEN
        teamService.delete(TEAM);

        // THEN
        verify(teamRepository).deleteById(TEAM.id());
    }

    @Test
    void shouldRejectDeletionWhenTeamParticipatesInAGame() {
        // GIVEN
        when(gameRepository.existsByTeamId(TEAM.id())).thenReturn(true);

        // WHEN / THEN
        assertThatThrownBy(() -> teamService.delete(TEAM))
                .isInstanceOf(TeamInUseException.class)
                .hasMessage("Team team_1 is still referenced by existing games");
        verify(teamRepository, never()).deleteById(TEAM.id());
    }
}
