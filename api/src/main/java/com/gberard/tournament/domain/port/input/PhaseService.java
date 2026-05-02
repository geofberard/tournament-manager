package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Phase;

import java.util.List;
import java.util.Optional;

public interface PhaseService {

    List<Phase> findAll();

    Optional<Phase> findById(String id);
}
