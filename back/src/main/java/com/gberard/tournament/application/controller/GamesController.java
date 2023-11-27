package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.response.GameDTO;
import com.gberard.tournament.application.response.GameDTOMapper;
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
    public List<GameDTO> getGames(@RequestParam Optional<String> teamId) {
        List<Game> games = teamId.isEmpty() ? gameService.readAll() : gameService.searchFor(teamId.get());

        return games.stream()
                .map(GameDTOMapper::toGameDTO)
                .toList();
    }

    @GetMapping("/games/{id}")
    public GameDTO getGame(@PathVariable String id) {
        return gameService.search(id)
                .map(GameDTOMapper::toGameDTO)
                .get();
    }

}
