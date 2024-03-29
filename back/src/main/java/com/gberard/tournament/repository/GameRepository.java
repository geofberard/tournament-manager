package com.gberard.tournament.repository;

import com.gberard.tournament.data.client.Game;
import com.gberard.tournament.data.score.ScoreType;
import com.gberard.tournament.serializer.DateRaw;
import com.gberard.tournament.serializer.ListRaw;
import com.gberard.tournament.serializer.TimeRaw;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.gberard.tournament.serializer.RawUtils.*;
import static com.gberard.tournament.serializer.RawUtils.getEnumValue;
import static com.gberard.tournament.serializer.score.ScoreRaw.getScoreDeserializer;
import static com.gberard.tournament.serializer.score.ScoreRaw.getScoreSerializer;
import static java.util.stream.Collectors.toList;

@Repository
public class GameRepository extends SheetRepository<Game> {

    @VisibleForTesting
    protected static final String RANGE = "Games!A2:I";

    @Autowired
    TeamRepository teamService;

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
        var contestantIds = getValue(value, 4, ListRaw::deserialize);
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
                DateRaw.serialize(game.time().toLocalDate()),
                TimeRaw.serialize(game.time().toLocalTime()),
                game.court(),
                ListRaw.serialize(game.contestantIds()),
                game.refereeId().orElse(""),
                game.isFinished().toString(),
                game.scoreType().toString(),
                game.score().map(getScoreSerializer(game)).orElse("")
        );
    }

}
