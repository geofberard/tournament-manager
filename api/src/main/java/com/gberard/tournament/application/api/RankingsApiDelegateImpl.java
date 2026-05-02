package com.gberard.tournament.application.api;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.gberard.tournament.application.mapper.StatisticsMapper;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.service.TeamStatsService;
import com.gberard.tournament.generated.api.StatisticsApiDelegate;
import com.gberard.tournament.generated.model.ContestantStats;

import jakarta.persistence.EntityNotFoundException;

@Service
public class RankingsApiDelegateImpl implements StatisticsApiDelegate {

    @Autowired
    public TeamStatsService teamStatsService;

    @Autowired
    public TeamService teamService;

    @Override
    public ResponseEntity<ContestantStats> getRankingByTeamId(String teamId) {
        Optional<Team> team = teamService.findById(teamId);

        if(team.isEmpty()) {
            throw new EntityNotFoundException("Unknown team " + teamId);
        }

        var teamStats = teamStatsService.getTeamStats(team.get());
        return ResponseEntity.ok(StatisticsMapper.toApi(teamStats));
    }

    @Override
    public ResponseEntity<List<ContestantStats>> listRankings() {
        List<ContestantStats> allStats = teamStatsService.getTeamsStats().stream()
                .map(StatisticsMapper::toApi)
                .toList();
        return ResponseEntity.ok(allStats);
    }

    @Override
    public ResponseEntity<List<ContestantStats>> listPhasePoolRankings(String phaseId, String poolId) {
        List<ContestantStats> poolStats = teamStatsService.getTeamsStatsByPool(poolId, phaseId).stream()
                .map(StatisticsMapper::toApi)
                .toList();

        return ResponseEntity.ok(poolStats);
    }
}
