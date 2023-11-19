package com.gberard.tournament.application.controller;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.infrastructure.repository.SheetTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
public class TeamsController {

    @Autowired
    public SheetTeamRepository teamService;

    @GetMapping("/teams")
    public List<Team> getTeams() {
        return teamService.readAll();
    }

    @GetMapping("/teams/{id}")
    public Team getTeam(@PathVariable String id) {
        return teamService.search(id).get();
    }

}
