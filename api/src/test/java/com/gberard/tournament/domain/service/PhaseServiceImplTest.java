package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.exception.PhaseHierarchyCycleException;
import com.gberard.tournament.domain.exception.PhaseHasChildrenException;
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

import java.util.Optional;
import java.util.List;

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

    @Test
    void shouldRejectDeletionWhenPhaseHasChildren() {
        Phase child = new Phase(
                "child", Optional.of(PHASE.id()), "Poule A", null, 1, Optional.of(PhaseType.POOL));
        when(phaseRepository.findAll()).thenReturn(List.of(PHASE, child));

        assertThatThrownBy(() -> phaseService.delete(PHASE))
                .isInstanceOf(PhaseHasChildrenException.class)
                .hasMessage("Phase phase_1 still contains child phases");
        verify(gameRepository, never()).existsByPhaseId(PHASE.id());
        verify(phaseRepository, never()).deleteById(PHASE.id());
    }

    @Test
    void shouldRejectMovingAPhaseUnderItself() {
        Phase phase = new Phase(
                "phase_1", Optional.of("phase_1"), "Brassage", null, 1, Optional.of(PhaseType.POOL));

        assertThatThrownBy(() -> phaseService.update(phase))
                .isInstanceOf(PhaseHierarchyCycleException.class)
                .hasMessage("Moving phase phase_1 under this parent would create a hierarchy cycle");
        verify(phaseRepository, never()).save(phase);
    }

    @Test
    void shouldRejectMovingAPhaseUnderOneOfItsDescendants() {
        Phase phase = new Phase(
                "phase_1", Optional.of("phase_3"), "Finales", null, 1, Optional.empty());
        Phase descendant = new Phase(
                "phase_3", Optional.of("phase_2"), "Finale", null, 1, Optional.empty());
        Phase child = new Phase(
                "phase_2", Optional.of("phase_1"), "Principale", null, 1, Optional.empty());
        when(phaseRepository.findById("phase_3")).thenReturn(Optional.of(descendant));
        when(phaseRepository.findById("phase_2")).thenReturn(Optional.of(child));

        assertThatThrownBy(() -> phaseService.update(phase))
                .isInstanceOf(PhaseHierarchyCycleException.class);
        verify(phaseRepository, never()).save(phase);
    }
}
