package com.gberard.tournament.application.controller;

import com.gberard.tournament.domain.client.Player;
import com.gberard.tournament.infrastructure.repository.SheetPlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class PlayersController {

    @Autowired
    public SheetPlayerRepository playerService;

    @GetMapping("/players")
    public List<Player> getPlayers() {
        return playerService.readAll();
    }

    @GetMapping("/players/{id}")
    public Player getPlayer(@PathVariable String id) {
        return playerService.search(id).get();
    }

}
