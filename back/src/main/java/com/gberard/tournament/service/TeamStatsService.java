package com.gberard.tournament.service;

import com.gberard.tournament.data.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.gberard.tournament.data.GameTeamStatus.*;
import static java.util.stream.Collectors.*;

@Component
public class TeamStatsService {

    @Autowired
    TeamService teamService;

    @Autowired
    GameService gameService;

    public List<TeamStats> getTeamsStats() {
        return teamService.getTeams().stream()
                .map(this::getTeamStats)
                .collect(toList());
    }

    public TeamStats getTeamStats(Team team) {
        return gameService.getGames().stream()
                .filter(game -> game.hasContestant(team))
                .reduce(
                        new TeamStatsAccumulator(team),
                        (reducer, game) -> updateStatsWith(reducer, game, team),
                        TeamStatsAccumulator::merge
                ).createTeamStatistic();
    }

    private static TeamStatsAccumulator updateStatsWith(TeamStatsAccumulator reducer, Game game, Team team) {
        GameTeamStatus teamResult = game.getTeamStatus(team);
        int pointsFor = game.getPointsFor(team).orElse(0);
        int pointsAgainst = game.getPointsAgainst(team).orElse(0);
        return reducer.addPlayed(teamResult != NOT_PLAYED ? 1 : 0)
                .addWon(teamResult == WIN ? 1 : 0)
                .addLost(teamResult == LOST ? 1 : 0)
                .addDrawn(teamResult == DRAWN ? 1 : 0)
                .addScore(teamResult.getPoints())
                .addPointsFor(pointsFor)
                .addPointsAgainst(pointsAgainst)
                .addPointsDiff(pointsFor - pointsAgainst);
    }

}
