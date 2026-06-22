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
                request.getStartTime() == null
                        ? null
                        : request.getStartTime().withOffsetSameInstant(ZoneOffset.UTC).toLocalDateTime(),
                request.getGameDurationMinutes() == null ? null : Duration.ofMinutes(request.getGameDurationMinutes()),
                request.getBreakDurationMinutes() == null ? null : Duration.ofMinutes(request.getBreakDurationMinutes()),
                request.getCourt(),
                request.getAssignReferees()
        );

        List<com.gberard.tournament.domain.model.Game> createdGames = plannedGames.stream()
                .map(gameService::create)
                .toList();

        return ResponseEntity.status(CREATED).body(toApi(createdGames));
    }

    @Override
    @Transactional
    public ResponseEntity<List<Game>> bulkUpdateGames(BulkUpdateGamesRequest bulkUpdateGamesRequest) {
        BulkGameChanges changes = bulkUpdateGamesRequest.getChanges();
        validateChanges(changes);

        List<com.gberard.tournament.domain.model.Game> existingGames = bulkUpdateGamesRequest.getGameIds().stream()
                .map(this::findGameOrThrow)
                .toList();
        if (changes.getTimeOffsetMinutes() != null && existingGames.stream().anyMatch(game -> game.time() == null)) {
            throw new ResponseStatusException(
                    BAD_REQUEST,
                    "timeOffsetMinutes cannot be used on games without time"
            );
        }
        Phase phase = changes.getPhaseId() == null ? null : findPhaseOrThrow(changes.getPhaseId());
        Optional<Team> referee = changes.getRefereeId() != null
                ? Optional.of(findTeamOrThrow(changes.getRefereeId()))
                : Boolean.TRUE.equals(changes.getClearReferee()) ? Optional.empty() : null;

        List<com.gberard.tournament.domain.model.Game> updatedGames = existingGames.stream()
                .map(game -> GameMapper.applyChanges(game, changes, phase, referee))
                .map(gameService::update)
                .toList();

        return ResponseEntity.ok(toApi(updatedGames));
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

        return ResponseEntity.status(CREATED).body(toApi(newGame));
    }

    @Override
    public ResponseEntity<Void> deleteGame(String gameId) {
        gameService.delete(findGameOrThrow(gameId));
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Game> getGameById(String gameId) {
        return ResponseEntity.ok(toApi(findGameOrThrow(gameId)));
    }

    @Override
    public ResponseEntity<List<Game>> listGames() {
        List<com.gberard.tournament.domain.model.Game> games = gameService.findAll();
        return ResponseEntity.ok(toApi(games));
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

        return ResponseEntity.ok(toApi(newGame));
    }

    private Game toApi(com.gberard.tournament.domain.model.Game game) {
        return toApi(List.of(game)).getFirst();
    }

    private List<Game> toApi(List<com.gberard.tournament.domain.model.Game> games) {
        return games.stream()
                .map(GameMapper::toApi)
                .toList();
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
        if (changes.getSubgroup() != null && Boolean.TRUE.equals(changes.getClearSubgroup())) {
            throw new ResponseStatusException(BAD_REQUEST, "subgroup and clearSubgroup cannot be used together");
        }
        if (changes.getRefereeId() != null && Boolean.TRUE.equals(changes.getClearReferee())) {
            throw new ResponseStatusException(BAD_REQUEST, "refereeId and clearReferee cannot be used together");
        }
        if (changes.getTime() != null && changes.getTimeOffsetMinutes() != null) {
            throw new ResponseStatusException(BAD_REQUEST, "time and timeOffsetMinutes cannot be used together");
        }
        if (changes.getTime() != null && Boolean.TRUE.equals(changes.getClearTime())) {
            throw new ResponseStatusException(BAD_REQUEST, "time and clearTime cannot be used together");
        }
        if (changes.getTimeOffsetMinutes() != null && Boolean.TRUE.equals(changes.getClearTime())) {
            throw new ResponseStatusException(BAD_REQUEST, "timeOffsetMinutes and clearTime cannot be used together");
        }
        if (changes.getPhaseId() == null
                && changes.getSubgroup() == null
                && !Boolean.TRUE.equals(changes.getClearSubgroup())
                && changes.getGroup() == null
                && changes.getTime() == null
                && !Boolean.TRUE.equals(changes.getClearTime())
                && changes.getTimeOffsetMinutes() == null
                && changes.getCourt() == null
                && changes.getRefereeId() == null
                && !Boolean.TRUE.equals(changes.getClearReferee())) {
            throw new ResponseStatusException(BAD_REQUEST, "At least one change is required");
        }
    }

    private void validateBulkCreateRequest(BulkCreateGamesRequest request, Phase phase) {
        if (phase.type().orElse(null) != PhaseType.POOL) {
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
        if (request.getStartTime() == null) {
            return;
        }
        if (request.getGameDurationMinutes() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Game duration is required when start time is provided");
        }
        if (request.getBreakDurationMinutes() == null) {
            throw new ResponseStatusException(BAD_REQUEST, "Break duration is required when start time is provided");
        }
        if (request.getGameDurationMinutes() < 1) {
            throw new ResponseStatusException(BAD_REQUEST, "Game duration must be positive");
        }
        if (request.getBreakDurationMinutes() < 0) {
            throw new ResponseStatusException(BAD_REQUEST, "Break duration must not be negative");
        }
    }

}
