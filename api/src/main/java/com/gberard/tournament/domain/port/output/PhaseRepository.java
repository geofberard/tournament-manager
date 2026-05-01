package com.gberard.tournament.domain.port.output;

import com.gberard.tournament.domain.model.Phase;

import java.util.Optional;

public interface PhaseRepository {

    Optional<Phase> findById(String id);
}
