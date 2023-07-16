package com.gberard.tournament.controller;

import com.gberard.tournament.data.Player;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.data.TeamV1;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class TeamsController {

    @Autowired
    public TeamRepository teamService;

    @GetMapping("/teams")
    public List<Team> getTeams() {
        return teamService.readAll();
    }

    @GetMapping("/teams/{id}")
    public Team getTeam(@PathVariable String id) {
        return teamService.search(id).get();
    }

}
