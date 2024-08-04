package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.dto.ContestantStatsDTO;
import com.gberard.tournament.domain.service.ContestantStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ContestantStatsController {

    @Autowired
    public ContestantStatsService teamStatsService;

    @GetMapping("/contestant-stats")
    public List<ContestantStatsDTO> getTeamsStats() {
        return teamStatsService.getContestantsStats().stream()
                .map(ContestantStatsDTO::fromContestantStats)
                .toList();
    }

}
