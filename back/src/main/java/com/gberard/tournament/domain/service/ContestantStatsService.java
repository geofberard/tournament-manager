package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.ContestantStatsUseCase;
import com.gberard.tournament.domain.model.stats.ContestantStats;
import com.gberard.tournament.domain.model.stats.ContestantStatsAccumulator;
import com.gberard.tournament.infrastructure.repository.SheetGameRepository;
import com.gberard.tournament.infrastructure.repository.SheetTeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

import static com.gberard.tournament.domain.model.stats.ContestantResult.*;
import static java.util.stream.Collectors.toList;

@Component
public class ContestantStatsService implements ContestantStatsUseCase {

    @Autowired
    SheetTeamRepository teamService;

    @Autowired
    SheetGameRepository gameService;

    @Override
    public List<ContestantStats> getContestantsStats() {
        return teamService.readAll().stream()
                .map(Team::id)
                .map(this::getContestantStats)
                .collect(toList());
    }

    @Override
    public ContestantStats getContestantStats(String contestantId) {
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
