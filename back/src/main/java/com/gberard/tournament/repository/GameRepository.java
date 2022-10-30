package com.gberard.tournament.repository;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.contestant.Contestant;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.gberard.tournament.data.DataUtils.*;
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

    public List<Game> searchFor(Contestant team) {
        return readAll().stream()
                .filter(game -> game.hasContestant(team))
                .collect(toList());
    }

    @Override
    protected Game fromRawData(List<Object> value) {
        var gameBuilder = Game.builder()
                .id(getValue(value, 0))
                .time(parseDateTime(getValue(value, 1), getValue(value, 2)))
                .court(getValue(value, 3));
        teamService.search(getValue(value, 4)).ifPresent(gameBuilder::contestantA);
        teamService.search(getValue(value, 5)).ifPresent(gameBuilder::contestantB);
        teamService.search(getValue(value, 6)).ifPresent(gameBuilder::referee);
        parseInteger(getValue(value, 7)).ifPresent(gameBuilder::scoreA);
        parseInteger(getValue(value, 8)).ifPresent(gameBuilder::scoreB);
        return gameBuilder.build();
    }

    @Override
    protected List<Object> toRawData(Game game) {
        return List.of(
                game.id(),
                formatDate(game.time()),
                formatTime(game.time()),
                game.court(),
                game.contestantA().id(),
                game.contestantB().id(),
                game.referee().map(Contestant::id).orElse(""),
                game.scoreA().map(Object::toString).orElse(""),
                game.scoreB().map(Object::toString).orElse("")
        );
    }

}
