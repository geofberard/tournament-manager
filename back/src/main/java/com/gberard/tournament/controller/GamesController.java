package com.gberard.tournament.controller;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.service.GameService;
import com.gberard.tournament.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class GamesController {

    @Autowired
    public GameService gameService;

    @Autowired
    public TeamService teamService;

    @GetMapping("/games")
    public List<Game> getTeams(@RequestParam Optional<String> teamId) {
        if(teamId.isPresent()) {
            Optional<Team> team = teamService.getTeam(teamId.get());
            return team.isEmpty() ? List.of() :  gameService.getGamesFor(team.get());
        }
        return gameService.getGames();
    }

}
