package com.gberard.tournament.controller;

import com.gberard.tournament.data.Team;
import com.gberard.tournament.service.SheetService;
import com.gberard.tournament.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@RestController
public class TeamsController {

    @Autowired
    public TeamService teamService;

    @GetMapping("/teams")
    public List<Team> getTeams() {
        return teamService.getTeams();
    }

}
