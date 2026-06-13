package com.gberard.tournament.application.mapper;

import static java.util.stream.Collectors.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.gberard.tournament.domain.model.GameBuilder;
import com.gberard.tournament.generated.model.BulkGameChanges;
import com.gberard.tournament.generated.model.CreateGameRequest;
import com.gberard.tournament.generated.model.GameStatus;
import com.gberard.tournament.generated.model.Team;
import com.gberard.tournament.generated.model.UpdateGameRequest;

public final class GameMapper {

    public static com.gberard.tournament.generated.model.Game toApi(com.gberard.tournament.domain.model.Game game) {
        return new com.gberard.tournament.generated.model.Game()
                .id(game.id())
                .phase(PhaseMapper.toApi(game.phase()))
                .name(game.name().orElse(null))
                .group(game.group())
                .court(game.court())
                .contestants(game.contestants().stream().map(TeamMapper::toApi).collect(toSet()))
                .referee(game.refereeId().map(TeamMapper::toApi).orElse(null))
                .time(game.time().atOffset(java.time.ZoneOffset.UTC))
                .status(resolveStatus(game))
                .score(game.score().map(score -> GameScoreMapper.toApi(score, game.contestants())).orElse(null));
    }

    public static com.gberard.tournament.domain.model.Game toDomain(
            CreateGameRequest request,
            com.gberard.tournament.domain.model.Phase phase,
            Set<com.gberard.tournament.domain.model.Team> contestants,
            Optional<com.gberard.tournament.domain.model.Team> referee
    ) {
        return new com.gberard.tournament.domain.model.Game(
                null,
                phase,
                Optional.ofNullable(request.getName()),
                request.getGroup(),
                request.getTime().toLocalDateTime(),
                request.getCourt(),
                List.copyOf(contestants),
                referee,
                false,
                Optional.empty()
        );
    }

    public static com.gberard.tournament.domain.model.Game toDomain(
            com.gberard.tournament.domain.model.Game existingGame,
            UpdateGameRequest request,
            com.gberard.tournament.domain.model.Phase phase,
            Set<com.gberard.tournament.domain.model.Team> contestants,
            Optional<com.gberard.tournament.domain.model.Team> referee
    ) {
        var updatedGame = GameBuilder.from(existingGame)
                .phase(phase)
                .name(Optional.ofNullable(request.getName()))
                .group(request.getGroup())
                .time(request.getTime().toLocalDateTime())
                .court(request.getCourt())
                .contestants(List.copyOf(contestants))
                .refereeId(referee)
                .isFinished(GameStatus.COMPLETED.equals(request.getStatus()));

        Set<String> existingContestantIds = existingGame.contestants().stream()
                .map(com.gberard.tournament.domain.model.Team::id)
                .collect(toSet());
        Set<String> updatedContestantIds = contestants.stream()
                .map(com.gberard.tournament.domain.model.Team::id)
                .collect(toSet());

        if (!existingContestantIds.equals(updatedContestantIds)) {
            updatedGame.eraseScore();
        }

        return updatedGame.build();
    }

    public static com.gberard.tournament.domain.model.Game applyChanges(
            com.gberard.tournament.domain.model.Game existingGame,
            BulkGameChanges changes,
            com.gberard.tournament.domain.model.Phase phase,
            Optional<com.gberard.tournament.domain.model.Team> referee
    ) {
        var updatedGame = GameBuilder.from(existingGame);

        if (phase != null) {
            updatedGame.phase(phase);
        }
        if (changes.getName() != null) {
            updatedGame.name(changes.getName());
        } else if (Boolean.TRUE.equals(changes.getClearName())) {
            updatedGame.eraseName();
        }
        if (changes.getGroup() != null) {
            updatedGame.group(changes.getGroup());
        }
        if (changes.getTime() != null) {
            updatedGame.time(changes.getTime().toLocalDateTime());
        }
        if (changes.getCourt() != null) {
            updatedGame.court(changes.getCourt());
        }
        if (changes.getStatus() != null) {
            updatedGame.isFinished(GameStatus.COMPLETED.equals(changes.getStatus()));
        }
        if (referee != null) {
            updatedGame.refereeId(referee);
        }

        return updatedGame.build();
    }

    private static GameStatus resolveStatus(com.gberard.tournament.domain.model.Game game) {
        if (game.isFinished()) {
            return GameStatus.COMPLETED;
        }

        if (game.score().isPresent()) {
            return GameStatus.IN_PROGRESS;
        }

        return GameStatus.SCHEDULED;
    }
}
