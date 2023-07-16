package com.gberard.tournament.controller;

import com.gberard.tournament.data.*;
import com.gberard.tournament.repository.TeamRepository;
import com.gberard.tournament.service.TeamStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class TeamStatsController {

    @Autowired
    public TeamStatsService teamStatsService;

    @GetMapping("/teams-stats")
    public List<ContestantStats> getTeamsStats() {
        return teamStatsService.getTeamsStats();
    }

    @GetMapping("/team-stats/{teamId}")
    public ContestantStats getTeamStats(@PathVariable String teamId) {
        return teamStatsService.getTeamStats(teamId);
    }

}
