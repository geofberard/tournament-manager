package com.gberard.tournament.domain.port.output;

import com.gberard.tournament.domain.model.Phase;

import java.util.List;
import java.util.Optional;

public interface PhaseRepository {

    List<Phase> findAll();

    Optional<Phase> findById(String id);

    Phase save(Phase phase);

    void deleteById(String id);
}
