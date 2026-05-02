package com.gberard.tournament.application.api;

import com.gberard.tournament.application.mapper.PhaseMapper;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.port.input.TeamStatsUseCase;
import com.gberard.tournament.domain.port.input.PhaseService;
import com.gberard.tournament.generated.api.PhasesApiDelegate;
import com.gberard.tournament.generated.model.Phase;
import com.gberard.tournament.generated.model.Pool;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

import jakarta.persistence.EntityNotFoundException;

@Service
public class PhasesApiDelegateImpl implements PhasesApiDelegate {

    @Autowired
    public PhaseService phaseService;

    @Autowired
    public TeamService teamService;

    @Autowired
    public TeamStatsUseCase teamStatsUseCase;

    @Override
    public ResponseEntity<List<Phase>> listPhases() {
        return ResponseEntity.ok(
                phaseService.findAll().stream()
                        .map(PhaseMapper::toApi)
                        .toList()
        );
    }

    @Override
    public ResponseEntity<List<Pool>> listPhasePools(String phaseId) {
        findPhaseOrThrow(phaseId);

        return ResponseEntity.ok(
                teamStatsUseCase.getPhasePools(phaseId).stream()
                        .map(poolId -> new Pool().id(poolId))
                        .toList()
        );
    }

    @Override
    public ResponseEntity<Pool> getPhaseTeamPool(String phaseId, String teamId) {
        findPhaseOrThrow(phaseId);
        var team = teamService.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Unknown team " + teamId));
        var pool = teamStatsUseCase.getTeamPool(team, phaseId)
                .orElseThrow(() -> new EntityNotFoundException("No pool found for team " + teamId));

        return ResponseEntity.ok(new Pool().id(pool));
    }

    private com.gberard.tournament.domain.model.Phase findPhaseOrThrow(String phaseId) {
        return phaseService.findById(phaseId)
                .orElseThrow(() -> new EntityNotFoundException("Unknown phase " + phaseId));
    }
}
