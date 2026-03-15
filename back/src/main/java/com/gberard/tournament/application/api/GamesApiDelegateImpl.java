package com.gberard.tournament.application.api;

import static java.util.stream.Collectors.*;
import static org.springframework.http.HttpStatus.CREATED;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.gberard.tournament.application.mapper.GameMapper;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.generated.api.GamesApiDelegate;
import com.gberard.tournament.generated.model.CreateGameRequest;
import com.gberard.tournament.generated.model.Game;
import com.gberard.tournament.generated.model.UpdateGameRequest;

import jakarta.persistence.EntityNotFoundException;

@Service
public class GamesApiDelegateImpl implements GamesApiDelegate {

    @Autowired
    public GameService gameService;

    @Autowired
    public TeamService teamService;

    @Override
    public ResponseEntity<Game> createGame(CreateGameRequest createGameRequest) {
        Set<Team> contestants = createGameRequest.getContestantIds().stream()
                .map(this::findContestantOrThrow)
                .collect(toSet());

        Optional<Team> referee = Optional.ofNullable(createGameRequest.getRefereeId())
                .map(this::findContestantOrThrow);

        var newGame = gameService.create(GameMapper.toDomain(createGameRequest, contestants, referee));

        return ResponseEntity.status(CREATED).body(GameMapper.toApi(newGame));
    }

    @Override
    public ResponseEntity<Void> deleteGame(String gameId) {
        gameService.delete(findGameOrThrow(gameId));
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Game> getGameById(String gameId) {
        return ResponseEntity.ok(GameMapper.toApi(findGameOrThrow(gameId)));
    }

    @Override
    public ResponseEntity<List<Game>> listGames() {
        List<Game> games = gameService.findAll().stream()
                .map(GameMapper::toApi)
                .toList();

        return ResponseEntity.ok(games);
    }

    @Override
    public ResponseEntity<Game> updateGame(String gameId, UpdateGameRequest updateGameRequest) {
        Set<Team> contestants = updateGameRequest.getContestantIds().stream()
                .map(this::findContestantOrThrow)
                .collect(toSet());

        Optional<Team> referee = Optional.ofNullable(updateGameRequest.getRefereeId())
                .map(this::findContestantOrThrow);

        var newGame = gameService.create(GameMapper.toDomain(gameId, updateGameRequest, contestants, referee));

        return ResponseEntity.ok(GameMapper.toApi(newGame));
    }

    private com.gberard.tournament.domain.model.Game findGameOrThrow(String id) {
        return gameService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unknown game " + id));
    }

    private com.gberard.tournament.domain.model.Team findContestantOrThrow(String contestantId) {
        return teamService.findById(contestantId)
                .orElseThrow(() -> new EntityNotFoundException("Unknown team " + contestantId));
    }
}