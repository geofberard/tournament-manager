package com.gberard.tournament.controller;

import com.gberard.tournament.data.stats.ContestantStats;
import com.gberard.tournament.service.ContestantStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ContestantStatsController {

    @Autowired
    public ContestantStatsService teamStatsService;

    @GetMapping("/contestant-stats")
    public List<ContestantStats> getTeamsStats() {
        return teamStatsService.getTeamsStats();
    }

    @GetMapping("/contestant-stats/{contestantId}")
    public ContestantStats getTeamStats(@PathVariable String contestantId) {
        return teamStatsService.getTeamStats(contestantId);
    }

}
