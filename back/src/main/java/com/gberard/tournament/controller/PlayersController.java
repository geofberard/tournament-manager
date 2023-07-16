package com.gberard.tournament.controller;

import com.gberard.tournament.data.Player;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.repository.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class PlayersController {

    @Autowired
    public PlayerRepository playerService;

    @GetMapping("/players")
    public List<Player> getPlayers() {
        return playerService.readAll();
    }

    @GetMapping("/players/{id}")
    public Player getPlayer(@PathVariable String id) {
        return playerService.search(id).get();
    }

}
