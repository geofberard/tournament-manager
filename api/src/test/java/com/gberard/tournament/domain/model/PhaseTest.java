package com.gberard.tournament.domain.model;

import org.junit.jupiter.api.Test;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class PhaseTest {

    @Test
    void should_allow_an_organizational_phase_without_a_type() {
        Phase phase = new Phase("phase", Optional.empty(), "Phase finale", null, 1, Optional.empty());

        assertThat(phase.type()).isEmpty();
    }

    @Test
    void should_allow_a_typed_child_phase() {
        Phase phase = new Phase(
                "main-bracket",
                Optional.of("final-phase"),
                "Principale",
                null,
                1,
                Optional.of(PhaseType.BRACKET));

        assertThat(phase.type()).contains(PhaseType.BRACKET);
    }
}
