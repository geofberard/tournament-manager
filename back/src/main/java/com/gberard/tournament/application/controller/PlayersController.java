package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.dto.CreatePlayerDTO;
import com.gberard.tournament.application.dto.PlayerDTO;
import com.gberard.tournament.application.dto.UpdatePlayerDTO;
import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.port.input.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/players")
public class PlayersController {

    @Autowired
    public PlayerService playerService;

    @GetMapping
    public ResponseEntity<List<PlayerDTO>> getPlayers() {
        List<PlayerDTO> players = playerService.findAll().stream()
                .map(PlayerDTO::toPlayerDTO)
                .toList();
        return ResponseEntity.ok(players);
    }

    @PostMapping
    public ResponseEntity<PlayerDTO> addPlayers(@RequestBody CreatePlayerDTO createPlayerDTO) {
        PlayerDTO createdPlayer = PlayerDTO.toPlayerDTO(playerService.create(createPlayerDTO.toPlayer()));
        return ResponseEntity.ok(createdPlayer);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDTO> getPlayer(@PathVariable String id) {
        return playerService.findById(id)
                .map(PlayerDTO::toPlayerDTO)
                .map(ResponseEntity::ok)
                .orElseGet(ResponseEntity.status(NOT_FOUND)::build);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(@PathVariable String id, @RequestBody UpdatePlayerDTO updatePlayerDTO) {
        return playerService.findById(id)
                .map(Player::id)
                .map(updatePlayerDTO::toPlayer)
                .map(playerService::update)
                .map(PlayerDTO::toPlayerDTO)
                .map(ResponseEntity::ok)
                .orElseGet(ResponseEntity.status(NOT_FOUND)::build);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable String id) {
        return playerService.findById(id)
                .map(playerService::delete)
                .map(_ -> new ResponseEntity<Void>(HttpStatus.NO_CONTENT))
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

}
