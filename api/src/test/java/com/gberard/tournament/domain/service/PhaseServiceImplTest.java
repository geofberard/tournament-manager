package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.exception.PhaseInUseException;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.PhaseType;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.domain.port.output.PhaseRepository;
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
class PhaseServiceImplTest {

    private static final Phase PHASE = new Phase("phase_1", "Brassage", null, 1, PhaseType.POOL);

    @InjectMocks
    private PhaseServiceImpl phaseService;

    @Mock
    private PhaseRepository phaseRepository;

    @Mock
    private GameRepository gameRepository;

    @Test
    void shouldDeletePhaseWhenItIsNotUsedByAnyGame() {
        // GIVEN
        when(gameRepository.existsByPhaseId(PHASE.id())).thenReturn(false);

        // WHEN
        phaseService.delete(PHASE);

        // THEN
        verify(phaseRepository).deleteById(PHASE.id());
    }

    @Test
    void shouldRejectDeletionWhenPhaseIsUsedByAGame() {
        // GIVEN
        when(gameRepository.existsByPhaseId(PHASE.id())).thenReturn(true);

        // WHEN / THEN
        assertThatThrownBy(() -> phaseService.delete(PHASE))
                .isInstanceOf(PhaseInUseException.class)
                .hasMessage("Phase phase_1 is still referenced by existing games");
        verify(phaseRepository, never()).deleteById(PHASE.id());
    }
}
