package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.port.input.PhaseService;
import com.gberard.tournament.domain.port.output.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PhaseServiceImpl implements PhaseService {

    @Autowired
    public PhaseRepository phaseRepository;

    @Override
    public Phase create(Phase phase) {
        return phaseRepository.save(phase);
    }

    @Override
    public Phase update(Phase phase) {
        return phaseRepository.save(phase);
    }

    @Override
    public boolean delete(Phase phase) {
        phaseRepository.deleteById(phase.id());
        return true;
    }

    @Override
    public List<Phase> findAll() {
        return phaseRepository.findAll();
    }

    @Override
    public Optional<Phase> findById(String id) {
        return phaseRepository.findById(id);
    }
}
