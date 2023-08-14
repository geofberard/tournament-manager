package com.gberard.tournament.service;

import com.gberard.tournament.data.client.Game;
import com.gberard.tournament.data.client.Team;
import com.gberard.tournament.data.stats.ContestantStats;
import com.gberard.tournament.data.stats.ContestantStatsAccumulator;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.gberard.tournament.data.stats.ContestantResult.*;
import static java.util.stream.Collectors.toList;

@Component
public class ContestantStatsService {

    @Autowired
    TeamRepository teamService;

    @Autowired
    GameRepository gameService;

    public List<ContestantStats> getTeamsStats() {
        return teamService.readAll().stream()
                .map(Team::id)
                .map(this::getTeamStats)
                .collect(toList());
    }

    public ContestantStats getTeamStats(String contestantId) {
        return gameService.readAll().stream()
                .filter(game -> game.contestantIds().contains(contestantId))
                .filter(Game::isFinished)
                .reduce(
                        new ContestantStatsAccumulator(contestantId),
                        (reducer, game) -> updateStatsWith(reducer, game, contestantId),
                        ContestantStatsAccumulator::merge
                ).create();
    }

    private static ContestantStatsAccumulator updateStatsWith(ContestantStatsAccumulator reducer, Game game, String contestantId) {
        game.score().ifPresent(score -> {
            var contestantResult = score.getTeamStatus(contestantId);
            var pointsFor = score.getPointFor(contestantId);
            var pointsAgainst = score.getPointAgainst(contestantId);
            reducer.addPlayed(1)
                    .addWon(contestantResult == WIN ? 1 : 0)
                    .addLost(contestantResult == LOST ? 1 : 0)
                    .addDrawn(contestantResult == DRAWN ? 1 : 0)
                    .addScore(contestantResult.getPoints())
                    .addPointsFor(pointsFor)
                    .addPointsAgainst(pointsAgainst)
                    .addPointsDiff(pointsFor - pointsAgainst);
        });
        return reducer;
    }

}
