package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Phase;

import java.util.List;
import java.util.Optional;

public interface PhaseService {

    Phase create(Phase phase);

    Phase update(Phase phase);

    boolean delete(Phase phase);

    List<Phase> findAll();

    Optional<Phase> findById(String id);
}
