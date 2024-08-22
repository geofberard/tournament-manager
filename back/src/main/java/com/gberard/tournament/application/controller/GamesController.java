package com.gberard.tournament.application.controller;

import com.fasterxml.jackson.annotation.JsonView;
import com.gberard.tournament.application.dto.*;
import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.port.output.GameRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/games")
public class GamesController {

    @Autowired
    public GameService gameService;

    @Autowired
    public TeamService teamService;

    @GetMapping
    public ResponseEntity<List<GameDTO>> getGames() {
        List<GameDTO> games = gameService.findAll().stream()
                .map(GameDTO::toGameDTO)
                .toList();

        return ResponseEntity.ok(games);
    }

    @PostMapping
    public ResponseEntity<GameDTO> createPlayers(@RequestBody CreateGameDTO createGameDTO) {
        List<Team> contestants = findMatchingTeams(createGameDTO.contestants());

        Game newGame = gameService.create(new Game(
                null,
                createGameDTO.time(),
                createGameDTO.court(),
                contestants,
                createGameDTO.referee().map(teamService::findById).flatMap(Function.identity()),
                createGameDTO.isFinished(),
                createGameDTO.scoreType(),
                Optional.empty()
        ));

        return ResponseEntity.status(CREATED).body(GameDTO.toGameDTO(newGame));
    }


    @GetMapping("/{id}")
    public ResponseEntity<GameDTO> getGame(@PathVariable String id) {
        return ResponseEntity.ok(GameDTO.toGameDTO(findMatchingGame(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameDTO> updateGame(@PathVariable String id, @RequestBody UpdateGameDTO updateGameDTO) {
        Game matchingGame = findMatchingGame(id);
        List<Team> contestants = findMatchingTeams(updateGameDTO.contestants());

        Game updatedGame = gameService.create(new Game(
                matchingGame.id(),
                updateGameDTO.time(),
                updateGameDTO.court(),
                contestants,
                updateGameDTO.referee().map(teamService::findById).flatMap(Function.identity()),
                updateGameDTO.isFinished(),
                updateGameDTO.scoreType(),
                Optional.empty()
        ));

        return ResponseEntity.ok(GameDTO.toGameDTO(updatedGame));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable String id) {
        gameService.delete(findMatchingGame(id));
        return ResponseEntity.noContent().build();
    }

    private Game findMatchingGame(String id) {
        Optional<Game> matchingGame = gameService.findById(id);

        if(matchingGame.isEmpty()) {
            throw new EntityNotFoundException("Unknown game " + id);
        }

        return matchingGame.get();
    }

    private List<Team> findMatchingTeams(List<String> teamIds) {
        List<Optional<Team>> potentialContestants = teamIds.stream()
                .map(teamService::findById)
                .toList();

        if (potentialContestants.stream().anyMatch(Optional::isEmpty)) {
            List<String> foundTeams = potentialContestants.stream()
                    .filter(Optional::isPresent)
                    .map(Optional::get)
                    .map(Team::id).toList();

            List<String> unknownTeams = teamIds.stream()
                    .filter(teamId -> !foundTeams.contains(teamId))
                    .toList();

            throw new EntityNotFoundException("Unknown teams " + unknownTeams);
        }

        List<Team> contestants = potentialContestants.stream()
                .filter(Optional::isPresent)
                .map(Optional::get)
                .toList();
        return contestants;
    }

}
