package com.gberard.tournament.controller;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.stats.ContestantStats;
import com.gberard.tournament.repository.TeamRepository;
import com.gberard.tournament.service.TeamStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class TeamStatsController {

    @Autowired
    public TeamStatsService teamStatsService;

    @Autowired
    public TeamRepository teamService;

    @GetMapping("/teams-stats")
    public List<ContestantStats> getTeamsStats() {
        return teamStatsService.getTeamsStats();
    }

    @GetMapping("/team-stats/{teamId}")
    public ContestantStats getTeam(@PathVariable String teamId) {
        Optional<Contestant> team = teamService.search(teamId);
        if(team.isEmpty()) {
            throw  new ResponseStatusException(NOT_FOUND, "Team not found");
        }
        return teamStatsService.getTeamStats(team.get());
    }

}
