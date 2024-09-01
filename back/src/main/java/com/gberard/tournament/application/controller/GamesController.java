package com.gberard.tournament.application.controller;

import com.gberard.tournament.application.dto.*;
import com.gberard.tournament.application.dto.score.ScoreDTO;
import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.GameBuilder;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.score.Score;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.input.TeamService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import static org.springframework.http.HttpStatus.CREATED;

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

    @PostMapping("/{id}/score")
    public ResponseEntity<ScoreDTO> addScore(@PathVariable String id, @RequestBody ScoreDTO scoreDTO) {
        Game matchingGame = findMatchingGame(id);

        if (matchingGame.score().isPresent()) {
            throw new EntityNotFoundException("Game already has a score (" + id + ")");
        }

        Score score = ScoreDTO.toDomain(scoreDTO, matchingGame.scoreType());
        if(!matchingGame.contestants().stream().allMatch(score::hasContestant)) {
            throw new IllegalStateException("Score contestants doesn't match those in target game (" + id + ")");
        }

        Game updatedGame = gameService.update(GameBuilder.from(matchingGame)
                .score(score)
                .build());

        return ResponseEntity.ok(ScoreDTO.toDTO(updatedGame.score().get(), updatedGame.scoreType()));
    }

    @GetMapping("/{id}/score")
    public ResponseEntity<ScoreDTO> getScore(@PathVariable String id) {
        Game matchingGame = findMatchingGame(id);

        if (matchingGame.score().isPresent()) {
            ScoreDTO scoreDTO = ScoreDTO.toDTO(matchingGame.score().get(), matchingGame.scoreType());
            return ResponseEntity.ok(scoreDTO);
        }

        throw new EntityNotFoundException("No score for this game");
    }

    @PutMapping("/{id}/score")
    public ResponseEntity<ScoreDTO> updateScore(@PathVariable String id, @RequestBody ScoreDTO score) {
        Game matchingGame = findMatchingGame(id);

        Game updatedGame = gameService.update(GameBuilder.from(matchingGame)
                .score(ScoreDTO.toDomain(score, matchingGame.scoreType()))
                .build());

        return ResponseEntity.ok(ScoreDTO.toDTO(updatedGame.score().get(), updatedGame.scoreType()));
    }

    @DeleteMapping("/{id}/score")
    public ResponseEntity<Void> deleteScore(@PathVariable String id) {
        Game matchingGame = findMatchingGame(id);

        Game updatedGame = gameService.update(GameBuilder.from(matchingGame)
                .eraseScore()
                .build());

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
