package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.response.PlayerDTO;
import com.gberard.tournament.domain.port.output.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PlayersController {

    @Autowired
    public PlayerRepository playerService;

    @GetMapping("/players")
    public List<PlayerDTO> getPlayers() {
        return playerService.readAll().stream()
                .map(PlayerDTO::toPlayerDTO)
                .toList();
    }

    @GetMapping("/players/{id}")
    public PlayerDTO getPlayer(@PathVariable String id) {
        return playerService.search(id)
                .map(PlayerDTO::toPlayerDTO)
                .get();
    }

}
