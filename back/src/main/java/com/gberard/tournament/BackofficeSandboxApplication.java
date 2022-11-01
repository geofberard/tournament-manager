package com.gberard.tournament;

import com.gberard.tournament.data.game.Game;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.contestant.Team;
import com.gberard.tournament.data.game.score.GameScore;
import com.gberard.tournament.data.game.score.SetScore;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//Remove comments before usage
//@SpringBootApplication
public class BackofficeSandboxApplication {


    private static Contestant contestant1 = new Team("Team1", "Les Viking");
    private static Contestant contestant2 = new Team("Team2", "Les Pilou-Pilou");
    private static Contestant contestant3 = new Team("Team3", "Les Baby Sharkies");
    private static Contestant contestant4 = new Team("Team4", "Les Mercenaires");
    private static Contestant contestant5 = new Team("Team5", "Les 4 Fantastiques");
    private static Contestant contestant6 = new Team("Team6", "L'équipe en carton");
    private static Contestant contestant7 = new Team("Team7", "Les Volley Fenêtre");

    private static List<Contestant> contestants = List.of(contestant1, contestant2, contestant3, contestant4, contestant5, contestant6, contestant7);
    private static List<Game> games = List.of(
            buildGame("Game1", 11, 00, "Terrain1", contestant1, contestant2),
            buildGame("Game2", 11, 00, "Terrain2", contestant3, contestant4),
            buildGame("Game3", 11, 00, "Terrain3", contestant5, contestant6),
            buildGame("Game4", 11, 20, "Terrain1", contestant1, contestant3),
            buildGame("Game5", 11, 20, "Terrain2", contestant5, contestant4),
            buildGame("Game6", 11, 20, "Terrain3", contestant6, contestant7),
            buildGame("Game7", 11, 40, "Terrain1", contestant1, contestant4),
            buildGame("Game8", 11, 40, "Terrain2", contestant2, contestant5),
            buildGame("Game9", 11, 40, "Terrain3", contestant7, contestant3),
            buildGame("Game10", 12, 00, "Terrain1", contestant1, contestant5),
            buildGame("Game11", 12, 00, "Terrain2", contestant6, contestant3),
            buildGame("Game12", 12, 00, "Terrain3", contestant2, contestant7),
            buildGame("Game13", 12, 20, "Terrain1", contestant3, contestant5),
            buildGame("Game14", 12, 20, "Terrain2", contestant2, contestant6),
            buildGame("Game15", 12, 20, "Terrain3", contestant4, contestant7),
            buildGame("Game16", 12, 40, "Terrain1", contestant1, contestant6),
            buildGame("Game17", 12, 40, "Terrain2", contestant2, contestant4),
            buildGame("Game18", 12, 40, "Terrain3", contestant5, contestant7),
            buildGame("Game19", 13, 00, "Terrain1", contestant1, contestant7),
            buildGame("Game20", 13, 00, "Terrain2", contestant2, contestant3),
            buildGame("Game21", 13, 00, "Terrain3", contestant4, contestant6),
            buildGame("Game22", 14, 30, "Terrain1", contestant1, contestant2),
            buildGame("Game23", 14, 30, "Terrain2", contestant3, contestant4),
            buildGame("Game24", 14, 30, "Terrain3", contestant5, contestant6),
            buildGame("Game25", 14, 50, "Terrain1", contestant1, contestant3),
            buildGame("Game26", 14, 50, "Terrain2", contestant5, contestant4),
            buildGame("Game27", 14, 50, "Terrain3", contestant6, contestant7),
            buildGame("Game28", 15, 10, "Terrain1", contestant1, contestant4),
            buildGame("Game29", 15, 10, "Terrain2", contestant2, contestant5),
            buildGame("Game30", 15, 10, "Terrain3", contestant7, contestant3),
            buildGame("Game31", 15, 30, "Terrain1", contestant1, contestant5),
            buildGame("Game32", 15, 30, "Terrain2", contestant6, contestant3),
            buildGame("Game33", 15, 30, "Terrain3", contestant2, contestant7),
            buildGame("Game34", 15, 50, "Terrain1", contestant3, contestant5),
            buildGame("Game35", 15, 50, "Terrain2", contestant2, contestant6),
            buildGame("Game36", 15, 50, "Terrain3", contestant4, contestant7),
            buildGame("Game37", 16, 10, "Terrain1", contestant1, contestant6),
            buildGame("Game38", 16, 10, "Terrain2", contestant2, contestant4),
            buildGame("Game39", 16, 10, "Terrain3", contestant5, contestant7),
            buildGame("Game40", 16, 30, "Terrain1", contestant1, contestant7),
            buildGame("Game41", 16, 30, "Terrain2", contestant2, contestant3),
            buildGame("Game42", 16, 30, "Terrain3", contestant4, contestant6)
    );

    @Autowired
    private TeamRepository teamService;

    @Autowired
    private GameRepository gameService;

    public static void main(String[] args) {
        SpringApplication.run(BackofficeSandboxApplication.class, args);
    }

    public static LocalDateTime toDate(int hour, int minute) {
        return LocalDateTime.now().withHour(hour).withMinute(minute);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() {
        teamService.deleteAll();
        gameService.deleteAll();
        contestants.forEach(teamService::create);
        games.forEach(gameService::create);
        gameService.delete(games.get(12));
        gameService.update(buildGame("Game12", 11, 40, "Terrain7", contestant1, contestant4));
        System.out.println("Done");
        System.exit(1);
    }

    private static Game buildGame(String game1, int hour, int minute, String terrain, Contestant contestant1, Contestant contestant2) {
        return Game.builder()
                .id(game1)
                .time(toDate(hour, minute))
                .court(terrain)
                .contestants(List.of(contestant1, contestant2))
                .score(randomSetScore(contestant1, contestant2))
                .build();
    }

    private static SetScore randomSetScore(Contestant contestant1, Contestant contestant2) {
        return new SetScore(List.of(
                randomGameScore(contestant1,contestant2),
                randomGameScore(contestant1,contestant2),
                randomGameScore(contestant1,contestant2)
        ));
    }

    private static GameScore randomGameScore(Contestant contestant1, Contestant contestant2) {
        return new GameScore(Map.of(
                contestant1.id(), (int) Math.round(Math.random() * 25),
                contestant2.id(), (int) Math.round(Math.random() * 25)
        ));
    }

}
