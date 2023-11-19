package com.gberard.tournament.application.controller;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.infrastructure.repository.SheetGameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Optional;

@RestController
public class GamesController {

    @Autowired
    public SheetGameRepository gameService;

    @GetMapping("/games")
    public List<Game> getGames(@RequestParam Optional<String> teamId) {
        return teamId.isEmpty() ? gameService.readAll() : gameService.searchFor(teamId.get());
    }

    @GetMapping("/games/{id}")
    public Game getGame(@PathVariable String id) {
        return gameService.search(id).get();
    }

}
