package com.gberard.tournament.repository;

import com.gberard.tournament.data.*;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import static com.gberard.tournament.data.DataUtils.*;
import static com.gberard.tournament.data.DataUtils.getEnumValue;
import static java.util.stream.Collectors.toList;

@Repository
public class GameRepository extends SheetRepository<Game> {

    @VisibleForTesting
    protected static final String RANGE = "Games!A2:I";

    @Autowired
    TeamV1Repository teamService;

    protected GameRepository() {
        super(RANGE);
    }

    public List<Game> searchFor(String teamId) {
        return readAll().stream()
                .filter(game -> game.contestantIds().contains(teamId))
                .collect(toList());
    }

    @Override
    protected Game fromRawData(List<Object> value) {
        var gameBuilder = Game.builder();
        var contestantIds = getListValue(value, 4);
        var scoreType = getEnumValue(value, 7, ScoreType.class);

        getStringValue(value, 0).ifPresent(gameBuilder::id);
        getDateTimeValue(value, 1,2).ifPresent(gameBuilder::time);
        getStringValue(value, 3).ifPresent(gameBuilder::court);
        contestantIds.ifPresent(gameBuilder::contestantIds);
        getStringValue(value, 5).ifPresent(gameBuilder::refereeId);
        getBooleanValue(value, 6).ifPresent(gameBuilder::isFinished);
        scoreType.ifPresent(gameBuilder::scoreType);
        getValue(value, 8, getScoreDeserializer(contestantIds.get(), scoreType.get()))
                .ifPresent(gameBuilder::score);

        return gameBuilder.build();
    }

    @Override
    protected List<Object> toRawData(Game game) {
        return List.of(
                game.id(),
                formatDate(game.time()),
                formatTime(game.time()),
                game.court(),
                toListValue(game.contestantIds()),
                game.refereeId().orElse(""),
                game.isFinished().toString(),
                game.scoreType().toString(),
                game.score().map(getScoreSerializer(game)).orElse("")
        );
    }

    private static Function<String, Score> getScoreDeserializer(List<String> contestentIds, ScoreType type) {
        return switch (type) {
            case DepthOne -> score -> DepthOneScoreRaw.deserialize(score, contestentIds);
            case DepthTwo -> score -> DepthTwoScoreRaw.deserialize(score, contestentIds);
            default -> throw new IllegalStateException("Unsuported score type : " + type);
        };
    }

    private static Function<Score, String> getScoreSerializer(Game game) {
        return switch (game.scoreType()) {
            case DepthOne -> score -> DepthOneScoreRaw.serialize((DepthOneScore) score, game.contestantIds());
            case DepthTwo -> score -> DepthTwoScoreRaw.serialize((DepthTwoScore) score, game.contestantIds());
            default -> throw new IllegalStateException("Unsuported score type : " + game.scoreType());
        };
    }

}
