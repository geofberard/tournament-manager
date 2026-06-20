package com.gberard.tournament.application.mapper;

import static java.util.stream.Collectors.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.gberard.tournament.domain.model.GameBuilder;
import com.gberard.tournament.generated.model.BulkGameChanges;
import com.gberard.tournament.generated.model.CreateGameRequest;
import com.gberard.tournament.generated.model.Team;
import com.gberard.tournament.generated.model.UpdateGameRequest;

public final class GameMapper {

    public static com.gberard.tournament.generated.model.Game toApi(com.gberard.tournament.domain.model.Game game) {
        return new com.gberard.tournament.generated.model.Game()
                .id(game.id())
                .phase(PhaseMapper.toApi(game.phase()))
                .subgroup(game.subgroup().orElse(null))
                .group(game.group())
                .court(game.court())
                .position(game.position())
                .contestants(game.contestants().stream().map(TeamMapper::toApi).collect(toSet()))
                .referee(game.refereeId().map(TeamMapper::toApi).orElse(null))
                .time(game.time() == null ? null : game.time().atOffset(java.time.ZoneOffset.UTC))
                .status(com.gberard.tournament.generated.model.GameStatus.valueOf(game.status().name()))
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
                Optional.ofNullable(request.getSubgroup()),
                request.getGroup(),
                request.getTime() == null ? null : request.getTime().toLocalDateTime(),
                request.getCourt(),
                null,
                List.copyOf(contestants),
                referee,
                com.gberard.tournament.domain.model.GameStatus.SCHEDULED,
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
                .subgroup(Optional.ofNullable(request.getSubgroup()))
                .group(request.getGroup())
                .time(request.getTime() == null ? null : request.getTime().toLocalDateTime())
                .court(request.getCourt())
                .position(existingGame.position())
                .contestants(List.copyOf(contestants))
                .refereeId(referee);

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
        if (changes.getSubgroup() != null) {
            updatedGame.subgroup(changes.getSubgroup());
        } else if (Boolean.TRUE.equals(changes.getClearSubgroup())) {
            updatedGame.eraseSubgroup();
        }
        if (changes.getGroup() != null) {
            updatedGame.group(changes.getGroup());
        }
        if (changes.getTime() != null) {
            updatedGame.time(changes.getTime().toLocalDateTime());
        } else if (Boolean.TRUE.equals(changes.getClearTime())) {
            updatedGame.time(null);
        } else if (changes.getTimeOffsetMinutes() != null) {
            updatedGame.time(existingGame.time().plusMinutes(changes.getTimeOffsetMinutes()));
        }
        if (changes.getCourt() != null) {
            updatedGame.court(changes.getCourt());
        }
        if (referee != null) {
            updatedGame.refereeId(referee);
        }

        return updatedGame.build();
    }

}
