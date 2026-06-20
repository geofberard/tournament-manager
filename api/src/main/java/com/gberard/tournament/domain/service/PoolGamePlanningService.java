package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.GameStatus;
import com.gberard.tournament.domain.model.Phase;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.scheduling.PlannedGame;
import com.gberard.tournament.domain.model.scheduling.TeamPair;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PoolGamePlanningService {

    private final RoundRobinTeamPairGenerator teamPairGenerator;
    private final SingleCourtTimeScheduler timeScheduler;
    private final TeamRefereeAllocator refereeAllocator;
    private final TeamOrderRandomizer teamOrderRandomizer;

    public PoolGamePlanningService(
            RoundRobinTeamPairGenerator teamPairGenerator,
            SingleCourtTimeScheduler timeScheduler,
            TeamRefereeAllocator refereeAllocator,
            TeamOrderRandomizer teamOrderRandomizer
    ) {
        this.teamPairGenerator = teamPairGenerator;
        this.timeScheduler = timeScheduler;
        this.refereeAllocator = refereeAllocator;
        this.teamOrderRandomizer = teamOrderRandomizer;
    }

    public List<Game> plan(
            Phase phase,
            String group,
            List<Team> teams,
            LocalDateTime startTime,
            Duration gameDuration,
            Duration breakDuration,
            String court,
            boolean assignReferees
    ) {
        if (court == null || court.isBlank()) {
            throw new IllegalArgumentException("court must not be blank");
        }

        List<Team> shuffledTeams = teamOrderRandomizer.shuffle(teams);
        List<TeamPair> teamPairs = teamPairGenerator.generate(shuffledTeams);
        List<PlannedGame> plannedGames = startTime == null
                ? teamPairs.stream()
                        .map(teamPair -> new PlannedGame(teamPair, null, Optional.empty()))
                        .toList()
                : timeScheduler.schedule(
                        teamPairs,
                        startTime,
                        gameDuration,
                        breakDuration
                );

        if (assignReferees) {
            plannedGames = refereeAllocator.allocate(plannedGames, shuffledTeams);
        }

        return plannedGames.stream()
                .map(plannedGame -> toGame(phase, group, court, plannedGame))
                .toList();
    }

    private Game toGame(
            Phase phase,
            String group,
            String court,
            PlannedGame plannedGame
    ) {
        return new Game(
                null,
                phase,
                Optional.empty(),
                group,
                plannedGame.time(),
                court,
                null,
                plannedGame.teamPair().teams(),
                plannedGame.referee(),
                GameStatus.SCHEDULED,
                Optional.empty()
        );
    }
}
