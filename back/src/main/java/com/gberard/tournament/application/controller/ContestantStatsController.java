package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.dto.ContestantStatsDTO;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.ContestantStats;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.service.ContestantStatsService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class ContestantStatsController {

    @Autowired
    public ContestantStatsService teamStatsService;

    @Autowired
    public TeamService teamService;

    @GetMapping("/teams/stats")
    public ResponseEntity<List<ContestantStatsDTO>> getTeamsStats() {
        List<ContestantStatsDTO> allStats = teamStatsService.getContestantsStats().stream()
                .map(ContestantStatsDTO::fromContestantStats)
                .toList();
        return ResponseEntity.ok(allStats);
    }

    @GetMapping("/teams/{id}/stats")
    public ResponseEntity<ContestantStatsDTO> getTeamStats(@PathVariable String id) {
        Optional<Team> team = teamService.findById(id);

        if(team.isEmpty()) {
            throw new EntityNotFoundException("Unknown team " + id);
        }

        ContestantStats contestantStats = teamStatsService.getContestantStats(team.get());
        return ResponseEntity.ok(ContestantStatsDTO.fromContestantStats(contestantStats));
    }

}
