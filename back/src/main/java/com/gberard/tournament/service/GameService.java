package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.gberard.tournament.data.DataUtils.*;
import static java.util.stream.Collectors.toList;

@Component
public class GameService {

    @Autowired
    TeamService teamService;

    @Autowired
    SheetService sheetService;

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    public boolean addGame(Game game) {
        return sheetService.create(spreadsheetConfig.getGameRange(), toRawData(game));
    }

    public List<Game> getGames() {
        return sheetService
                .readAll(spreadsheetConfig.getGameRange())
                .map(this::toGame)
                .collect(toList());
    }

    public List<Game> getGamesFor(Team team) {
        return getGames().stream()
                .filter(game -> game.hasContestant(team))
                .collect(toList());
    }

    public boolean deleteAll() {
        return sheetService.deleteAll(spreadsheetConfig.getGameRange());
    }

    @VisibleForTesting
    protected Game toGame(List<Object> value) {
        var gameBuilder = Game.builder()
                .id(getValue(value, 0))
                .time(parseDateTime(getValue(value, 1), getValue(value, 2)))
                .court(getValue(value, 3));
        teamService.getTeam(getValue(value, 4)).ifPresent(gameBuilder::teamA);
        teamService.getTeam(getValue(value, 5)).ifPresent(gameBuilder::teamB);
        teamService.getTeam(getValue(value, 6)).ifPresent(gameBuilder::referee);
        parseInteger(getValue(value, 7)).ifPresent(gameBuilder::scoreA);
        parseInteger(getValue(value, 8)).ifPresent(gameBuilder::scoreB);
        return gameBuilder.build();
    }

    @VisibleForTesting
    protected List<Object> toRawData(Game game) {
        return List.of(
                game.id(),
                formatDate(game.time()),
                formatTime(game.time()),
                game.court(),
                game.teamA().id(),
                game.teamB().id(),
                game.referee().map(Team::id).orElse(""),
                game.scoreA().map(Object::toString).orElse(""),
                game.scoreB().map(Object::toString).orElse("")
        );
    }

}
