package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.GameStatus;
import com.gberard.tournament.domain.model.stats.PhaseStatistics;
import com.gberard.tournament.domain.model.stats.TeamStats;
import com.gberard.tournament.domain.port.input.PhaseStatisticsUseCase;
import com.gberard.tournament.domain.port.output.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class PhaseStatisticsService implements PhaseStatisticsUseCase {

    @Autowired
    GameRepository gameRepository;

    @Override
    public PhaseStatistics getPhaseStatistics(String phaseId) {
        var games = gameRepository.findAll().stream()
                .filter(game -> game.phasePath().stream().anyMatch(phase -> phase.id().equals(phaseId)))
                .toList();
        var gameCount = games.size();
        var teamStats = TeamStatsService.buildTeamsStats(games);
        var teams = teamStats.stream()
                .map(TeamStats::team)
                .toList();

        if (gameCount == 0) {
            return new PhaseStatistics(0, 0, teams, teamStats);
        }

        var completedGameCount = games.stream()
                .filter(game -> game.status() == GameStatus.COMPLETED)
                .count();

        return new PhaseStatistics(gameCount, completedGameCount / (double) gameCount, teams, teamStats);
    }
}
