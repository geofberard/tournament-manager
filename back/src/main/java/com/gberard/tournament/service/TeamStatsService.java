package com.gberard.tournament.service;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.Game;
import com.gberard.tournament.data.game.ContestantResult;
import com.gberard.tournament.data.stats.ContestantStats;
import com.gberard.tournament.data.stats.ContestantStatsAccumulator;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data.game.ContestantResult.*;
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
        Optional<ContestantResult> teamResult = game.score().map(score -> score.getTeamStatus(contestant));
        int pointsFor = game.score().map(score -> score.getPointFor(contestant)).orElse(0);
        int pointsAgainst = game.score().map(score -> score.getPointAgainst(contestant)).orElse(0);
        return reducer.addPlayed(game.isFinished() ? 1 : 0)
                .addWon(teamResult.map(value -> value == WIN ? 1 : 0).orElse(0))
                .addLost(teamResult.map(value -> value == LOST ? 1 : 0).orElse(0))
                .addDrawn(teamResult.map(value -> value == DRAWN ? 1 : 0).orElse(0))
                .addScore(teamResult.map(ContestantResult::getPoints).orElse(0))
                .addPointsFor(pointsFor)
                .addPointsAgainst(pointsAgainst)
                .addPointsDiff(pointsFor - pointsAgainst);
    }

}
