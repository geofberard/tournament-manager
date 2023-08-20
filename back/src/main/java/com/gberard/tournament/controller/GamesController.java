package com.gberard.tournament.controller;

import com.gberard.tournament.data.client.Game;
import com.gberard.tournament.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class GamesController {

    @Autowired
    public GameRepository gameService;

    @GetMapping("/games")
    @PreAuthorize("permitAll")
    public List<Game> getGames(@RequestParam Optional<String> teamId) {
        return teamId.isEmpty() ? gameService.readAll() : gameService.searchFor(teamId.get());
    }

    @GetMapping("/games/{id}")
    public Game getGame(@PathVariable String id) {
        return gameService.search(id).get();
    }

}
