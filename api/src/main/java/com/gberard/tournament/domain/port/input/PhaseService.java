package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Phase;

import java.util.Optional;

public interface PhaseService {

    Optional<Phase> findById(String id);
}
