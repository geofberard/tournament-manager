package com.gberard.tournament;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.contestant.Team;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.time.LocalDateTime;
import java.util.List;

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
            buildGame("Game1", 11, 00, "Terrain1", contestant1, 15, contestant2, 23),
            buildGame("Game2", 11, 00, "Terrain2", contestant3, 21, contestant4, 15),
            buildGame("Game3", 11, 00, "Terrain3", contestant5, 11, contestant6, 22),
            buildGame("Game4", 11, 20, "Terrain1", contestant1, 8, contestant3, 26),
            buildGame("Game5", 11, 20, "Terrain2", contestant5, 15, contestant4, 26),
            buildGame("Game6", 11, 20, "Terrain3", contestant6, 14, contestant7, 26),
            buildGame("Game7", 11, 40, "Terrain1", contestant1, 14, contestant4, 28),
            buildGame("Game8", 11, 40, "Terrain2", contestant2, 20, contestant5, 16),
            buildGame("Game9", 11, 40, "Terrain3", contestant7, 25, contestant3, 16),
            buildGame("Game10", 12, 00, "Terrain1", contestant1, 21, contestant5, 22),
            buildGame("Game11", 12, 00, "Terrain2", contestant6, 17, contestant3, 22),
            buildGame("Game12", 12, 00, "Terrain3", contestant2, 18, contestant7, 23),
            buildGame("Game13", 12, 20, "Terrain1", contestant3, 22, contestant5, 17),
            buildGame("Game14", 12, 20, "Terrain2", contestant2, 18, contestant6, 23),
            buildGame("Game15", 12, 20, "Terrain3", contestant4, 17, contestant7, 16),
            buildGame("Game16", 12, 40, "Terrain1", contestant1, 17, contestant6, 20),
            buildGame("Game17", 12, 40, "Terrain2", contestant2, 17, contestant4, 23),
            buildGame("Game18", 12, 40, "Terrain3", contestant5, 16, contestant7, 21),
            buildGame("Game19", 13, 00, "Terrain1", contestant1, 10, contestant7, 20),
            buildGame("Game20", 13, 00, "Terrain2", contestant2, 19, contestant3, 19),
            buildGame("Game21", 13, 00, "Terrain3", contestant4, 22, contestant6, 23),
            buildGame("Game22", 14, 30, "Terrain1", contestant1, 15, contestant2, 24),
            buildGame("Game23", 14, 30, "Terrain2", contestant3, 21, contestant4, 19),
            buildGame("Game24", 14, 30, "Terrain3", contestant5, 18, contestant6, 24),
            buildGame("Game25", 14, 50, "Terrain1", contestant1, 14, contestant3, 23),
            buildGame("Game26", 14, 50, "Terrain2", contestant5, 14, contestant4, 23),
            buildGame("Game27", 14, 50, "Terrain3", contestant6, 15, contestant7, 23),
            buildGame("Game28", 15, 10, "Terrain1", contestant1, 14, contestant4, 23),
            buildGame("Game29", 15, 10, "Terrain2", contestant2, 21, contestant5, 20),
            buildGame("Game30", 15, 10, "Terrain3", contestant7, 21, contestant3, 18),
            buildGame("Game31", 15, 30, "Terrain1", contestant1, 22, contestant5, 15),
            buildGame("Game32", 15, 30, "Terrain2", contestant6, 19, contestant3, 22),
            buildGame("Game33", 15, 30, "Terrain3", contestant2, 18, contestant7, 23),
            buildGame("Game34", 15, 50, "Terrain1", contestant3, 17, contestant5, 16),
            buildGame("Game35", 15, 50, "Terrain2", contestant2, 20, contestant6, 17),
            buildGame("Game36", 15, 50, "Terrain3", contestant4, 15, contestant7, 20),
            buildGame("Game37", 16, 10, "Terrain1", contestant1, 17, contestant6, 29),
            buildGame("Game38", 16, 10, "Terrain2", contestant2, 19, contestant4, 19),
            buildGame("Game39", 16, 10, "Terrain3", contestant5, 13, contestant7, 26),
            buildGame("Game40", 16, 30, "Terrain1", contestant1, 8, contestant7, 22),
            buildGame("Game41", 16, 30, "Terrain2", contestant2, 18, contestant3, 20),
            buildGame("Game42", 16, 30, "Terrain3", contestant4, 20, contestant6, 17)
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
        gameService.update(buildGame("Game12", 11, 40, "Terrain7", contestant1, 14, contestant4, 28));
        System.out.println("Done");
        System.exit(1);
    }

    private static Game buildGame(String game1, int hour, int minute, String terrain, Contestant contestant1, int scoreA, Contestant contestant2,
                                  int scoreB) {
        return Game.builder()
                .id(game1)
                .time(toDate(hour, minute))
                .court(terrain)
                .contestantA(contestant1)
                .contestantB(contestant2)
                .scoreA(scoreA)
                .scoreB(scoreB)
                .build();
    }

}
