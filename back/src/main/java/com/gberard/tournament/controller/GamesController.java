package com.gberard.tournament.controller;

import com.gberard.tournament.data.*;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.gberard.tournament.controller.TeamsController.*;
import static com.gberard.tournament.data.ScoreType.DepthOne;
import static com.gberard.tournament.data.ScoreType.DepthTwo;

@RestController
public class GamesController {

    @Autowired
    public GameRepository gameService;

    @Autowired
    public TeamRepository teamService;

    private List<Game> games = List.of(
            new Game("game1",
                    LocalDateTime.of(2023, 01, 01, 12, 00),
                    "Terrain1",
                    List.of(TEAM3, TEAM1),
                    Optional.of(TEAM2), true, DepthOne, Optional.of(new DepthOneScore(Map.of(TEAM3.id(), 25, TEAM1.id(), 12)))),
            new Game("game2",
                    LocalDateTime.of(2023, 01, 01, 12, 00),
                    "Terrain2",
                    List.of(TEAM3, TEAM2),
                    Optional.of(TEAM1), true, DepthOne, Optional.of(new DepthOneScore(Map.of(TEAM3.id(), 25, TEAM2.id(), 23)))),
            new Game("game3",
                    LocalDateTime.of(2023, 01, 01, 12, 00),
                    "Terrain3",
                    List.of(TEAM3, TEAM4),
                    Optional.of(TEAM2), true, DepthOne, Optional.of(new DepthOneScore(Map.of(TEAM3.id(), 25, TEAM4.id(), 17)))),
            new Game("game4",
                    LocalDateTime.of(2023, 01, 01, 12, 00),
                    "Terrain1",
                    List.of(TEAM2, TEAM1),
                    Optional.of(TEAM3), true, DepthTwo, Optional.of(new DepthTwoScore(List.of(new DepthOneScore(Map.of(TEAM2.id(), 25, TEAM1.id(), 15)), new DepthOneScore(Map.of(TEAM2.id(), 25, TEAM1.id(), 15)))))),
            new Game("game5",
                    LocalDateTime.of(2023, 01, 01, 12, 00),
                    "Terrain2",
                    List.of(TEAM4, TEAM2),
                    Optional.of(TEAM1), true, DepthOne, Optional.empty()),
            new Game("game6",
                    LocalDateTime.of(2023, 01, 01, 12, 00),
                    "Terrain3",
                    List.of(TEAM4, TEAM1),
                    Optional.of(TEAM3), false, DepthOne, Optional.of(new DepthOneScore(Map.of(TEAM4.id(), 4, TEAM1.id(), 25))))
    );

    @GetMapping("/games")
    public List<Game> getGames(@RequestParam Optional<String> teamId) {
        return games;
    }

    @GetMapping("/games/{id}")
    public Game getGame(@PathVariable String id) {
        return games.stream()
                .filter(game -> game.id().equals(id))
                .findFirst().get();
    }

    @GetMapping("/games-for-team/{teamId}")
    public List<Game> getTeamStats(@PathVariable String teamId) {
        return games.stream()
                .filter(game -> game.contestants().stream().map(Contestant::id).toList().contains(teamId))
                .toList();
    }

}
