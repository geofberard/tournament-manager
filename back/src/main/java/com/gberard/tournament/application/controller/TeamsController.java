package com.gberard.tournament.application.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.gberard.tournament.application.response.ContestantStatsDTO;
import com.gberard.tournament.application.response.TeamDTO;
import com.gberard.tournament.application.response.Views;
import com.gberard.tournament.domain.port.output.TeamRepository;
import com.gberard.tournament.domain.service.ContestantStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class TeamsController {

    @Autowired
    public TeamRepository teamService;

    @Autowired
    public ContestantStatsService teamStatsService;

    @JsonView(Views.Team.Full.class)
    @GetMapping("/teams")
    public List<TeamDTO> getTeams() {
        return teamService.readAll().stream()
                .map(TeamDTO::toTeamDTO)
                .toList();
    }

    @JsonView(Views.Team.Full.class)
    @GetMapping("/teams/{id}")
    public TeamDTO getTeam(@PathVariable String id) {
        return teamService.search(id)
                .map(TeamDTO::toTeamDTO)
                .get();
    }

    @GetMapping("/teams/{id}/stats")
    public Optional<ContestantStatsDTO> getTeamStats(@PathVariable String id) {
        return teamService.search(id)
                .map(teamStatsService::getContestantStats)
                .map(ContestantStatsDTO::fromContestantStats);
    }

}
