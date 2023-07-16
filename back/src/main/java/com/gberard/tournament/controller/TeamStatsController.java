package com.gberard.tournament.controller;

import com.gberard.tournament.data.*;
import com.gberard.tournament.repository.TeamRepository;
import com.gberard.tournament.service.TeamStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static com.gberard.tournament.controller.GamesController.*;
import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class TeamStatsController {

    @Autowired
    public TeamStatsService teamStatsService;

    @Autowired
    public TeamRepository teamService;

    public static List<Player> players = List.of(
            new Player("player1", "Michel", "Drucker"),
            new Player("player2", "Jean", "Michel"),
            new Player("player3", "Michel", "Polnaref"),
            new Player("player4", "Jean", "Reno"),
            new Player("player5", "Michel", "Cymes"),
            new Player("player6", "Jean", "Paul2"),
            new Player("player7", "Michel", "EtAugustin"),
            new Player("player8", "Jean", "PeuPlus")
    );

    public static final Team TEAM1 = new Team("team1", "Team1", List.of(players.get(0).id(), players.get(1).id()));
    public static final Team TEAM2 = new Team("team2", "Team2", List.of(players.get(2).id(), players.get(3).id()));
    public static final Team TEAM3 = new Team("team3", "Team3", List.of(players.get(4).id(), players.get(5).id()));
    public static final Team TEAM4 = new Team("team4", "Team4", List.of(players.get(6).id(), players.get(7).id()));

    private Map<String, TeamStats> stats = Map.of(
            TEAM1.id(), new TeamStats(TEAM1, 3, 2, 0, 1, 6, 200, 57, 143),
            TEAM2.id(), new TeamStats(TEAM2, 2, 1, 1, 0, 9, 110, 87, 23),
            TEAM3.id(), new TeamStats(TEAM3, 3, 3, 0, 0, 9, 225, 37, 188),
            TEAM4.id(), new TeamStats(TEAM4, 2, 0, 1, 1, 9, 90, 102, -12)
    );

    @GetMapping("/teams-stats")
    public List<TeamStats> getTeamsStats() {
        return stats.values().stream().toList();
    }

    @GetMapping("/team-stats/{teamId}")
    public TeamStats getTeamStats(@PathVariable String teamId) {
        return stats.get(teamId);
    }

}
