package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.ContestantStatsUseCase;
import com.gberard.tournament.domain.model.stats.ContestantStats;
import com.gberard.tournament.domain.model.stats.ContestantStatsAccumulator;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.domain.port.output.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.gberard.tournament.domain.model.stats.ContestantResult.*;
import static java.util.stream.Collectors.toList;

@Component
public class ContestantStatsService implements ContestantStatsUseCase {

    @Autowired
    TeamRepository teamService;

    @Autowired
    GameRepository gameService;

    @Override
    public List<ContestantStats> getContestantsStats() {
        return teamService.readAll().stream()
                .map(this::getContestantStats)
                .collect(toList());
    }

    @Override
    public ContestantStats getContestantStats(Team contestant) {
        return gameService.readAll().stream()
                .filter(game -> game.contestants().stream().anyMatch(team -> team.id() == contestant.id()))
                .filter(Game::isFinished)
                .reduce(
                        new ContestantStatsAccumulator(contestant),
                        (reducer, game) -> updateStatsWith(reducer, game, contestant),
                        ContestantStatsAccumulator::merge
                ).create();
    }

    private static ContestantStatsAccumulator updateStatsWith(ContestantStatsAccumulator reducer, Game game, Team contestant) {
        game.score().ifPresent(score -> {
            var contestantResult = score.getTeamStatus(contestant);
            var pointsFor = score.getPointFor(contestant);
            var pointsAgainst = score.getPointAgainst(contestant);
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
