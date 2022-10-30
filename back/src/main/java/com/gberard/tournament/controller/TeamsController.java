package com.gberard.tournament.controller;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class TeamsController {

    @Autowired
    public TeamRepository teamService;

    @GetMapping("/teams")
    public List<Contestant> getTeams() {
        return teamService.readAll();
    }

    @GetMapping("/teams/{id}")
    public Contestant getTeam(@PathVariable String id) {
        return teamService.search(id)
                .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Unable to find resource"));
    }

}
