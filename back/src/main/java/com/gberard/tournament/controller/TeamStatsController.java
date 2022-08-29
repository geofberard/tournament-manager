package com.gberard.tournament.controller;

import com.gberard.tournament.data.Team;
import com.gberard.tournament.data.TeamStats;
import com.gberard.tournament.service.TeamService;
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
    public TeamService teamService;

    @GetMapping("/teams-stats")
    public List<TeamStats> getTeamsStats() {
        return teamStatsService.getTeamsStats();
    }

    @GetMapping("/team-stats/{teamId}")
    public TeamStats getTeam(@PathVariable String teamId) {
        Optional<Team> team = teamService.search(teamId);
        if(team.isEmpty()) {
            throw  new ResponseStatusException(NOT_FOUND, "Team not found");
        }
        return teamStatsService.getTeamStats(team.get());
    }

}
