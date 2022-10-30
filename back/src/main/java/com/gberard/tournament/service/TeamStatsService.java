package com.gberard.tournament.service;

import com.gberard.tournament.data.*;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.stats.ContestantStats;
import com.gberard.tournament.data.stats.ContestantStatsAccumulator;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.gberard.tournament.data.GameTeamStatus.*;
import static java.util.stream.Collectors.toList;

@Component
public class TeamStatsService {

    @Autowired
    TeamRepository teamService;

    @Autowired
    GameRepository gameService;

    public List<ContestantStats> getTeamsStats() {
        return teamService.readAll().stream()
                .map(this::getTeamStats)
                .collect(toList());
    }

    public ContestantStats getTeamStats(Contestant contestant) {
        return gameService.readAll().stream()
                .filter(game -> game.hasContestant(contestant))
                .reduce(
                        new ContestantStatsAccumulator(contestant),
                        (reducer, game) -> updateStatsWith(reducer, game, contestant),
                        ContestantStatsAccumulator::merge
                ).createTeamStatistic();
    }

    private static ContestantStatsAccumulator updateStatsWith(ContestantStatsAccumulator reducer, Game game, Contestant contestant) {
        GameTeamStatus teamResult = game.getTeamStatus(contestant);
        int pointsFor = game.getPointsFor(contestant).orElse(0);
        int pointsAgainst = game.getPointsAgainst(contestant).orElse(0);
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
