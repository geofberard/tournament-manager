package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.dto.CreatePlayerDTO;
import com.gberard.tournament.application.dto.PlayerDTO;
import com.gberard.tournament.application.dto.UpdatePlayerDTO;
import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.port.input.PlayerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.CREATED;

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
    public ResponseEntity<PlayerDTO> createPlayers(@RequestBody CreatePlayerDTO createPlayerDTO) {
        Player newPlayer = playerService.create(createPlayerDTO.firstname(), createPlayerDTO.lastname());
        return ResponseEntity.status(CREATED).body(PlayerDTO.toPlayerDTO(newPlayer));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDTO> getPlayer(@PathVariable String id) {
        return playerService.findById(id)
                .map(PlayerDTO::toPlayerDTO)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(@PathVariable String id, @RequestBody UpdatePlayerDTO updatePlayerDTO) {
        Player updatedPlayer = playerService.update(id, updatePlayerDTO.firstname(), updatePlayerDTO.lastname());
        return ResponseEntity.ok(PlayerDTO.toPlayerDTO(updatedPlayer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable String id) {
        return playerService.delete(id) ?
                ResponseEntity.noContent().build() :
                ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

}
