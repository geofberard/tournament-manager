package com.gberard.tournament.application.controller;

import com.gberard.tournament.domain.model.stats.ContestantStats;
import com.gberard.tournament.domain.service.ContestantStatsService;
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
        return teamStatsService.getContestantsStats();
    }

    @GetMapping("/contestant-stats/{contestantId}")
    public ContestantStats getTeamStats(@PathVariable String contestantId) {
        return teamStatsService.getContestantStats(contestantId);
    }

}
