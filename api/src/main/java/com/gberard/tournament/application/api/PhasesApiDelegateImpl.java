package com.gberard.tournament.application.api;

import static org.springframework.http.HttpStatus.CREATED;

import com.gberard.tournament.application.mapper.PhaseMapper;
import com.gberard.tournament.application.mapper.StatisticsMapper;
import com.gberard.tournament.domain.port.input.PhaseService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.port.input.TeamStatsUseCase;
import com.gberard.tournament.generated.api.PhasesApiDelegate;
import com.gberard.tournament.generated.model.ContestantStats;
import com.gberard.tournament.generated.model.CreatePhaseRequest;
import com.gberard.tournament.generated.model.Phase;
import com.gberard.tournament.generated.model.Pool;
import com.gberard.tournament.generated.model.UpdatePhaseRequest;
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
    public ResponseEntity<Phase> createPhase(CreatePhaseRequest createPhaseRequest) {
        var newPhase = phaseService.create(PhaseMapper.toDomain(createPhaseRequest));

        return ResponseEntity.status(CREATED).body(PhaseMapper.toApi(newPhase));
    }

    @Override
    public ResponseEntity<Void> deletePhase(String phaseId) {
        phaseService.delete(findPhaseOrThrow(phaseId));
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Phase> getPhaseById(String phaseId) {
        return ResponseEntity.ok(PhaseMapper.toApi(findPhaseOrThrow(phaseId)));
    }

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

    @Override
    public ResponseEntity<List<ContestantStats>> listPhasePoolRankings(String phaseId, String poolId) {
        findPhaseOrThrow(phaseId);

        return ResponseEntity.ok(teamStatsUseCase.getTeamsStatsByPool(poolId, phaseId).stream()
                .map(StatisticsMapper::toApi)
                .toList());
    }

    @Override
    public ResponseEntity<Phase> updatePhase(String phaseId, UpdatePhaseRequest updatePhaseRequest) {
        findPhaseOrThrow(phaseId);

        var updatedPhase = phaseService.update(PhaseMapper.toDomain(phaseId, updatePhaseRequest));

        return ResponseEntity.ok(PhaseMapper.toApi(updatedPhase));
    }

    private com.gberard.tournament.domain.model.Phase findPhaseOrThrow(String phaseId) {
        return phaseService.findById(phaseId)
                .orElseThrow(() -> new EntityNotFoundException("Unknown phase " + phaseId));
    }
}
