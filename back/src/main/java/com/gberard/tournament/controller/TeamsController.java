package com.gberard.tournament.controller;

import com.gberard.tournament.data.Player;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.data.TeamV1;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Map;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
public class TeamsController {

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

    public static final Team TEAM1 = new Team("team1", "Team1", List.of(players.get(0), players.get(1)));
    public static final Team TEAM2 = new Team("team2", "Team2", List.of(players.get(2), players.get(3)));
    public static final Team TEAM3 = new Team("team3", "Team3", List.of(players.get(4), players.get(5)));
    public static final Team TEAM4 = new Team("team4", "Team4", List.of(players.get(6), players.get(7)));

    public static Map<String, Team> teams = Map.of(
            "team1", TEAM1,
            "team2", TEAM2,
            "team3", TEAM3,
            "team4", TEAM4
    );

    @Autowired
    public TeamRepository teamService;

    @GetMapping("/teams")
    public List<Team> getTeams() {
        return teams.values().stream().toList();
    }

    @GetMapping("/teams/{id}")
    public Team getTeam(@PathVariable String id) {
        return teams.get(id);
    }

}
