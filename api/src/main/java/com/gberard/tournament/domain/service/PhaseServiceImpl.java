package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.exception.PhaseInUseException;
import com.gberard.tournament.domain.exception.PhaseHierarchyCycleException;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.port.input.PhaseService;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.domain.port.output.PhaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
public class PhaseServiceImpl implements PhaseService {

    @Autowired
    public PhaseRepository phaseRepository;

    @Autowired
    public GameRepository gameRepository;

    @Override
    public Phase create(Phase phase) {
        validateHierarchy(phase);
        return phaseRepository.save(phase);
    }

    @Override
    public Phase update(Phase phase) {
        validateHierarchy(phase);
        return phaseRepository.save(phase);
    }

    @Override
    public boolean delete(Phase phase) {
        if (gameRepository.existsByPhaseId(phase.id())) {
            throw new PhaseInUseException(phase.id());
        }

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

    private void validateHierarchy(Phase phase) {
        Set<String> visitedPhaseIds = new HashSet<>();
        if (phase.id() != null) {
            visitedPhaseIds.add(phase.id());
        }

        Optional<String> parentId = phase.parentId();
        while (parentId.isPresent()) {
            String currentParentId = parentId.get();
            if (!visitedPhaseIds.add(currentParentId)) {
                throw new PhaseHierarchyCycleException(phase.id());
            }

            parentId = phaseRepository.findById(currentParentId)
                    .flatMap(Phase::parentId);
        }
    }
}
