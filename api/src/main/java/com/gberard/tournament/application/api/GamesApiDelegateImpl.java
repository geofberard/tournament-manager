package com.gberard.tournament.application.api;

import static java.util.stream.Collectors.*;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CREATED;

import java.time.Duration;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.gberard.tournament.application.mapper.GameMapper;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.PhaseType;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.GameService;
import com.gberard.tournament.domain.port.input.PhaseService;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.service.PoolGamePlanningService;
import com.gberard.tournament.generated.api.GamesApiDelegate;
import com.gberard.tournament.generated.model.BulkCreateGamesRequest;
import com.gberard.tournament.generated.model.BulkGameChanges;
import com.gberard.tournament.generated.model.BulkUpdateGamesRequest;
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

    @Autowired
    public PhaseService phaseService;

    @Autowired
    public PoolGamePlanningService poolGamePlanningService;

    @Override
    @Transactional
    public ResponseEntity<List<Game>> bulkCreateGames(BulkCreateGamesRequest request) {
        Phase phase = findPhaseOrThrow(request.getPhaseId());
        validateBulkCreateRequest(request, phase);

        if (!gameService.findByGroupAndPhase(request.getGroup(), phase.id()).isEmpty()) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "Group " + request.getGroup() + " already contains games in phase " + phase.id()
            );
        }

        List<Team> teams = request.getTeamIds().stream()
                .map(this::findTeamOrThrow)
                .toList();

        List<com.gberard.tournament.domain.model.Game> plannedGames = poolGamePlanningService.plan(
                phase,
                request.getGroup(),
                teams,
                request.getStartTime().withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime(),
                Duration.ofMinutes(request.getGameDurationMinutes()),
                Duration.ofMinutes(request.getBreakDurationMinutes()),
                request.getCourt(),
                request.getAssignReferees()
        );

        List<Game> createdGames = plannedGames.stream()
                .map(gameService::create)
                .map(GameMapper::toApi)
                .toList();

        return ResponseEntity.status(CREATED).body(createdGames);
    }

    @Override
    @Transactional
    public ResponseEntity<List<Game>> bulkUpdateGames(BulkUpdateGamesRequest bulkUpdateGamesRequest) {
        BulkGameChanges changes = bulkUpdateGamesRequest.getChanges();
        validateChanges(changes);

        List<com.gberard.tournament.domain.model.Game> existingGames = bulkUpdateGamesRequest.getGameIds().stream()
                .map(this::findGameOrThrow)
                .toList();
        Phase phase = changes.getPhaseId() == null ? null : findPhaseOrThrow(changes.getPhaseId());
        Optional<Team> referee = changes.getRefereeId() != null
                ? Optional.of(findTeamOrThrow(changes.getRefereeId()))
                : Boolean.TRUE.equals(changes.getClearReferee()) ? Optional.empty() : null;

        List<Game> updatedGames = existingGames.stream()
                .map(game -> GameMapper.applyChanges(game, changes, phase, referee))
                .map(gameService::update)
                .map(GameMapper::toApi)
                .toList();

        return ResponseEntity.ok(updatedGames);
    }

    @Override
    public ResponseEntity<Game> createGame(CreateGameRequest createGameRequest) {
        Set<Team> contestants = createGameRequest.getContestantIds().stream()
                .map(this::findTeamOrThrow)
                .collect(toSet());

        Optional<Team> referee = Optional.ofNullable(createGameRequest.getRefereeId())
                .map(this::findTeamOrThrow);

        Phase phase = findPhaseOrThrow(createGameRequest.getPhaseId());

        var newGame = gameService.create(GameMapper.toDomain(createGameRequest, phase, contestants, referee));

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
        var existingGame = findGameOrThrow(gameId);
        Set<Team> contestants = updateGameRequest.getContestantIds().stream()
                .map(this::findTeamOrThrow)
                .collect(toSet());

        Optional<Team> referee = Optional.ofNullable(updateGameRequest.getRefereeId())
                .map(this::findTeamOrThrow);

        Phase phase = findPhaseOrThrow(updateGameRequest.getPhaseId());

        var newGame = gameService.update(GameMapper.toDomain(existingGame, updateGameRequest, phase, contestants, referee));

        return ResponseEntity.ok(GameMapper.toApi(newGame));
    }

    private com.gberard.tournament.domain.model.Game findGameOrThrow(String id) {
        return gameService.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Unknown game " + id));
    }

    private com.gberard.tournament.domain.model.Team findTeamOrThrow(String teamId) {
        return teamService.findById(teamId)
                .orElseThrow(() -> new EntityNotFoundException("Unknown team " + teamId));
    }

    private Phase findPhaseOrThrow(String phaseId) {
        return phaseService.findById(phaseId)
                .orElseThrow(() -> new EntityNotFoundException("Unknown phase " + phaseId));
    }

    private void validateChanges(BulkGameChanges changes) {
        if (changes.getName() != null && Boolean.TRUE.equals(changes.getClearName())) {
            throw new ResponseStatusException(BAD_REQUEST, "name and clearName cannot be used together");
        }
        if (changes.getRefereeId() != null && Boolean.TRUE.equals(changes.getClearReferee())) {
            throw new ResponseStatusException(BAD_REQUEST, "refereeId and clearReferee cannot be used together");
        }
        if (changes.getTime() != null && changes.getTimeOffsetMinutes() != null) {
            throw new ResponseStatusException(BAD_REQUEST, "time and timeOffsetMinutes cannot be used together");
        }
        if (changes.getPhaseId() == null
                && changes.getName() == null
                && !Boolean.TRUE.equals(changes.getClearName())
                && changes.getGroup() == null
                && changes.getTime() == null
                && changes.getTimeOffsetMinutes() == null
                && changes.getCourt() == null
                && changes.getStatus() == null
                && changes.getRefereeId() == null
                && !Boolean.TRUE.equals(changes.getClearReferee())) {
            throw new ResponseStatusException(BAD_REQUEST, "At least one change is required");
        }
    }

    private void validateBulkCreateRequest(BulkCreateGamesRequest request, Phase phase) {
        if (phase.type() != PhaseType.POOL) {
            throw new ResponseStatusException(BAD_REQUEST, "Games can only be generated for a pool phase");
        }
        if (request.getTeamIds().size() < 2) {
            throw new ResponseStatusException(BAD_REQUEST, "At least two teams are required");
        }
        if (request.getAssignReferees() && request.getTeamIds().size() < 3) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "At least three teams are required to assign team referees"
            );
        }
        if (request.getGameDurationMinutes() < 1) {
            throw new ResponseStatusException(BAD_REQUEST, "Game duration must be positive");
        }
        if (request.getBreakDurationMinutes() < 0) {
            throw new ResponseStatusException(BAD_REQUEST, "Break duration must not be negative");
        }
    }
}
