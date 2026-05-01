package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.port.input.PhaseService;
import com.gberard.tournament.domain.port.output.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class PhaseServiceImpl implements PhaseService {

    @Autowired
    public PhaseRepository phaseRepository;

    @Override
    public Optional<Phase> findById(String id) {
        return phaseRepository.findById(id);
    }
}
