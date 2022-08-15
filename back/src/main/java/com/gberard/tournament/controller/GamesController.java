package com.gberard.tournament.controller;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.service.GameService;
import com.gberard.tournament.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class GamesController {

    @Autowired
    public GameService gameService;

    @GetMapping("/games")
    public List<Game> getTeams() {
        return gameService.getGames();
    }

}
