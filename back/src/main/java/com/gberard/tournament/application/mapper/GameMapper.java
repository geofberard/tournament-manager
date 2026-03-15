package com.gberard.tournament.application.mapper;

import static java.util.stream.Collectors.*;

import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.gberard.tournament.domain.model.score.ScoreType;
import com.gberard.tournament.generated.model.CreateGameRequest;
import com.gberard.tournament.generated.model.GameStatus;
import com.gberard.tournament.generated.model.Team;
import com.gberard.tournament.generated.model.UpdateGameRequest;

public final class GameMapper {

    public static com.gberard.tournament.generated.model.Game toApi(com.gberard.tournament.domain.model.Game game) {
        return new com.gberard.tournament.generated.model.Game()
                .id(game.id())
                .court(game.court())
                .contestants(game.contestants().stream().map(TeamMapper::toApi).collect(toSet()))
                .referee(game.refereeId().map(TeamMapper::toApi).orElse(null))
                .time(game.time().atOffset(ZoneOffset.UTC))
                .status(game.isFinished() ? GameStatus.COMPLETED : GameStatus.SCHEDULED);
    }

    public static com.gberard.tournament.domain.model.Game toDomain(
            CreateGameRequest request,
            Set<com.gberard.tournament.domain.model.Team> contestants,
            Optional<com.gberard.tournament.domain.model.Team> referee
    ) {
        return new com.gberard.tournament.domain.model.Game(
                null,
                request.getTime().toLocalDateTime(),
                request.getCourt(),
                List.copyOf(contestants),
                referee,
                false,
                ScoreType.Set,
                Optional.empty()
        );
    }

    public static com.gberard.tournament.domain.model.Game toDomain(
            String id,
            UpdateGameRequest request,
            Set<com.gberard.tournament.domain.model.Team> contestants,
            Optional<com.gberard.tournament.domain.model.Team> referee
    ) {
        return new com.gberard.tournament.domain.model.Game(
                id,
                request.getTime().toLocalDateTime(),
                request.getCourt(),
                List.copyOf(contestants),
                referee,
                false,
                ScoreType.Set,
                Optional.empty()
        );
    }
}
