package com.gberard.tournament.application.mapper;

import static java.util.stream.Collectors.*;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import com.gberard.tournament.generated.model.CreateGameRequest;
import com.gberard.tournament.generated.model.GameStatus;
import com.gberard.tournament.generated.model.Team;
import com.gberard.tournament.generated.model.UpdateGameRequest;

public final class GameMapper {

    public static com.gberard.tournament.generated.model.Game toApi(com.gberard.tournament.domain.model.Game game) {
        return new com.gberard.tournament.generated.model.Game()
                .id(game.id())
                .phase(PhaseMapper.toApi(game.phase()))
                .pool(game.pool())
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
                request.getPool(),
                request.getTime().toLocalDateTime(),
                request.getCourt(),
                List.copyOf(contestants),
                referee,
                false,
                Optional.empty()
        );
    }

    public static com.gberard.tournament.domain.model.Game toDomain(
            String id,
            UpdateGameRequest request,
            com.gberard.tournament.domain.model.Phase phase,
            Set<com.gberard.tournament.domain.model.Team> contestants,
            Optional<com.gberard.tournament.domain.model.Team> referee
    ) {
        return new com.gberard.tournament.domain.model.Game(
                id,
                phase,
                request.getPool(),
                request.getTime().toLocalDateTime(),
                request.getCourt(),
                List.copyOf(contestants),
                referee,
                GameStatus.COMPLETED.equals(request.getStatus()),
                Optional.empty()
        );
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
