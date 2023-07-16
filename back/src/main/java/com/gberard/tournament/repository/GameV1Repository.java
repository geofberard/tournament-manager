package com.gberard.tournament.repository;

import com.gberard.tournament.data.*;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.gberard.tournament.data.DataUtils.*;
import static java.util.stream.Collectors.toList;

@Repository
public class GameV1Repository extends SheetRepository<GameV1> {

    @VisibleForTesting
    protected static final String RANGE = "Games!A2:I";

    @Autowired
    TeamV1Repository teamService;

    protected GameV1Repository() {
        super(RANGE);
    }

    public List<GameV1> searchFor(TeamV1 team) {
        return readAll().stream()
                .filter(game -> game.hasContestant(team))
                .collect(toList());
    }

    @Override
    protected GameV1 fromRawData(List<Object> value) {
        var gameBuilder = GameV1.builder()
                .id(getValue(value, 0))
                .time(parseDateTime(getValue(value, 1), getValue(value, 2)))
                .court(getValue(value, 3));
        teamService.search(getValue(value, 4)).ifPresent(gameBuilder::teamA);
        teamService.search(getValue(value, 5)).ifPresent(gameBuilder::teamB);
        teamService.search(getValue(value, 6)).ifPresent(gameBuilder::referee);
        parseInteger(getValue(value, 7)).ifPresent(gameBuilder::scoreA);
        parseInteger(getValue(value, 8)).ifPresent(gameBuilder::scoreB);
        return gameBuilder.build();
    }

    @Override
    protected List<Object> toRawData(GameV1 game) {
        return List.of(
                game.id(),
                formatDate(game.time()),
                formatTime(game.time()),
                game.court(),
                game.teamA().id(),
                game.teamB().id(),
                game.referee().map(TeamV1::id).orElse(""),
                game.scoreA().map(Object::toString).orElse(""),
                game.scoreB().map(Object::toString).orElse("")
        );
    }

}
