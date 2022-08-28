package com.gberard.tournament.service;

import com.gberard.tournament.config.SpreadsheetConfig;
import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.GameBuilder;
import com.gberard.tournament.data.Team;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.gberard.tournament.data.DataUtils.parseDate;
import static com.gberard.tournament.data.DataUtils.parseInteger;
import static com.gberard.tournament.service.SheetService.getValue;
import static java.util.stream.Collectors.toList;

@Component
public class GameService {

    @Autowired
    TeamService teamService;

    @Autowired
    SheetService sheetService;

    @Autowired
    private SpreadsheetConfig spreadsheetConfig;

    public List<Game> getGames(){
        return sheetService
                .getData(spreadsheetConfig.getGameRange())
                .map(this::mapGame)
                .collect(toList());
    }

    public List<Game> getGamesFor(Team team){
        return getGames().stream()
                .filter(game -> game.hasContestant(team))
                .collect(toList());
    }

    @VisibleForTesting
    protected Game mapGame(List<Object> value) {
        return new GameBuilder()
                .setTime(parseDate(getValue(value, 0), getValue(value, 1)))
                .setCourt(getValue(value, 2))
                .setTeamA(teamService.getTeam(getValue(value, 3)).get())
                .setTeamB(teamService.getTeam(getValue(value, 4)).get())
                .setReferee(teamService.getTeam(getValue(value, 5)))
                .setScoreA(parseInteger(getValue(value, 6)))
                .setScoreB(parseInteger(getValue(value, 7)))
                .createGame();
    }

}
