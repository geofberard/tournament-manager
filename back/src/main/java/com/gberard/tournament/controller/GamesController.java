package com.gberard.tournament.controller;

import com.gberard.tournament.data.game.Game;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class GamesController {

    @Autowired
    public GameRepository gameService;

    @Autowired
    public TeamRepository teamService;

    @GetMapping("/games")
    public List<Game> getTeams(@RequestParam Optional<String> teamId) {
        if(teamId.isPresent()) {
            Optional<Contestant> team = teamService.search(teamId.get());
            return team.isEmpty() ? List.of() :  gameService.searchFor(team.get());
        }
        return gameService.readAll();
    }

}
