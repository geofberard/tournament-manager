package com.gberard.tournament.controller;

import com.gberard.tournament.data.TeamStats;
import com.gberard.tournament.service.TeamStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class TeamStatsController {

    @Autowired
    public TeamStatsService teamStatsService;

    @GetMapping("/teams-stats")
    public List<TeamStats> getTeamsStats() {
        return teamStatsService.getTeamsStats();
    }

}
