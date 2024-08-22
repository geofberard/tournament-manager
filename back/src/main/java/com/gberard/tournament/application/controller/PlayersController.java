package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.dto.CreatePlayerDTO;
import com.gberard.tournament.application.dto.PlayerDTO;
import com.gberard.tournament.application.dto.UpdatePlayerDTO;
import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.port.input.PlayerService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

import static org.springframework.http.HttpStatus.CREATED;
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
    public ResponseEntity<PlayerDTO> createPlayers(@RequestBody CreatePlayerDTO createPlayerDTO) {
        Player newPlayer = playerService.create(createPlayerDTO.toPlayer());
        return ResponseEntity.status(CREATED).body(PlayerDTO.toPlayerDTO(newPlayer));
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlayerDTO> getPlayer(@PathVariable String id) {
        return ResponseEntity.ok(PlayerDTO.toPlayerDTO(findMatchingPlayer(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlayerDTO> updatePlayer(@PathVariable String id, @RequestBody UpdatePlayerDTO updatePlayerDTO) {
        Player matchingPlayer = findMatchingPlayer(id);

        Player updatedPlayer = playerService.update(updatePlayerDTO.toPlayer(matchingPlayer.id()));

        return ResponseEntity.ok(PlayerDTO.toPlayerDTO(updatedPlayer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlayer(@PathVariable String id) {
        playerService.delete(findMatchingPlayer(id));
        return ResponseEntity.noContent().build();
    }

    private Player findMatchingPlayer(String id) {
        Optional<Player> matchingPlayer = playerService.findById(id);

        if(matchingPlayer.isEmpty()) {
            throw new EntityNotFoundException("Unknown player " + id);
        }

        return matchingPlayer.get();
    }

}
