package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.stats.TeamStats;
import com.gberard.tournament.domain.model.stats.TeamStatsAccumulator;
import com.gberard.tournament.domain.port.input.TeamStatsUseCase;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.domain.port.output.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.domain.model.stats.TeamResult.DRAWN;
import static com.gberard.tournament.domain.model.stats.TeamResult.LOST;
import static com.gberard.tournament.domain.model.stats.TeamResult.WIN;

@Component
public class TeamStatsService implements TeamStatsUseCase {

    @Autowired
    TeamRepository teamRepository;

    @Autowired
    GameRepository gameRepository;

    @Override
    public List<TeamStats> getTeamsStats() {
        return teamRepository.findAll().stream()
                .map(this::getTeamStats)
                .toList();
    }

    @Override
    public TeamStats getTeamStats(Team team) {
        return buildTeamStats(team, gameRepository.findByTeamId(team.id()));
    }

    @Override
    public List<TeamStats> getTeamsStatsByPool(String pool) {
        List<Game> poolGames = gameRepository.findByPool(pool);

        return poolGames.stream()
                .flatMap(game -> game.contestants().stream())
                .distinct()
                .map(team -> buildTeamStats(team, poolGames))
                .toList();
    }

    @Override
    public Optional<String> getTeamPool(Team team) {
        return gameRepository.findByTeamId(team.id()).stream()
                .filter(game -> game.contestants().stream().anyMatch(contestant -> contestant.id().equals(team.id())))
                .map(Game::pool)
                .distinct()
                .reduce((first, second) -> {
                    throw new IllegalStateException("Team " + team.id() + " belongs to multiple pools");
                });
    }

    private TeamStats buildTeamStats(Team team, List<Game> games) {
        return games.stream()
                .filter(game -> game.contestants().stream().anyMatch(contestant -> contestant.id().equals(team.id())))
                .filter(Game::isFinished)
                .reduce(
                        new TeamStatsAccumulator(team),
                        (accumulator, game) -> updateStatsWith(accumulator, game, team),
                        TeamStatsAccumulator::merge
                )
                .create();
    }

    private static TeamStatsAccumulator updateStatsWith(TeamStatsAccumulator accumulator, Game game, Team team) {
        game.score().ifPresent(score -> {
            var teamResult = score.getTeamStatus(team);
            var pointsFor = score.getPointFor(team);
            var pointsAgainst = score.getPointAgainst(team);
            accumulator.addPlayed(1)
                    .addWon(teamResult == WIN ? 1 : 0)
                    .addLost(teamResult == LOST ? 1 : 0)
                    .addDrawn(teamResult == DRAWN ? 1 : 0)
                    .addScore(teamResult.getPoints())
                    .addPointsFor(pointsFor)
                    .addPointsAgainst(pointsAgainst)
                    .addPointsDiff(pointsFor - pointsAgainst);
        });
        return accumulator;
    }
}
