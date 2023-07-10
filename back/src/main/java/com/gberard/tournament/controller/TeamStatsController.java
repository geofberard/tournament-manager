package com.gberard.tournament.controller;

import com.gberard.tournament.data.TeamStats;
import com.gberard.tournament.data.TeamV1;
import com.gberard.tournament.data.TeamStatsV1;
import com.gberard.tournament.repository.TeamRepository;
import com.gberard.tournament.service.TeamStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.gberard.tournament.controller.TeamsController.*;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class TeamStatsController {

    @Autowired
    public TeamStatsService teamStatsService;

    @Autowired
    public TeamRepository teamService;

    private Map<String, TeamStats> stats = Map.of(
            TEAM1.id(), new TeamStats(TEAM1, 3, 2, 0, 1, 6, 200, 57, 143),
            TEAM2.id(), new TeamStats(TEAM2, 2, 1, 1, 0, 9, 110, 87, 23),
            TEAM3.id(), new TeamStats(TEAM3, 3, 3, 0, 0, 9, 225, 37, 188),
            TEAM4.id(), new TeamStats(TEAM4, 2, 0, 1, 1, 9, 90, 102, -12)
    );

    @GetMapping("/teams-stats")
    public List<TeamStats> getTeamsStats() {
        return stats.values().stream().toList();
    }

    @GetMapping("/team-stats/{teamId}")
    public TeamStats getTeamStats(@PathVariable String teamId) {
        return stats.get(teamId);
    }

}
