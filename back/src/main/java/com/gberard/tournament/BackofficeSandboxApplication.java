package com.gberard.tournament;

import com.gberard.tournament.data.client.Game;
import com.gberard.tournament.data.client.Team;
import com.gberard.tournament.data.score.DepthOneScore;
import com.gberard.tournament.data.score.ScoreType;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

//Remove comments before usage
//@SpringBootApplication
public class BackofficeSandboxApplication {


    private static Team Team1 = new Team("Team1", "Les Viking", List.of());
    private static Team Team2 = new Team("Team2", "Les Pilou-Pilou", List.of());
    private static Team Team3 = new Team("Team3", "Les Baby Sharkies", List.of());
    private static Team Team4 = new Team("Team4", "Les Mercenaires", List.of());
    private static Team Team5 = new Team("Team5", "Les 4 Fantastiques", List.of());
    private static Team Team6 = new Team("Team6", "L'équipe en carton", List.of());
    private static Team Team7 = new Team("Team7", "Les Volley Fenêtre", List.of());

    private static List<Team> teams = List.of(Team1, Team2, Team3, Team4, Team5, Team6, Team7);
    private static List<Game> games = List.of(
            buildGame("Game1", 11, 00, "Terrain1", Team1, 15, Team2, 23),
            buildGame("Game2", 11, 00, "Terrain2", Team3, 21, Team4, 15),
            buildGame("Game3", 11, 00, "Terrain3", Team5, 11, Team6, 22),
            buildGame("Game4", 11, 20, "Terrain1", Team1, 8, Team3, 26),
            buildGame("Game5", 11, 20, "Terrain2", Team5, 15, Team4, 26),
            buildGame("Game6", 11, 20, "Terrain3", Team6, 14, Team7, 26),
            buildGame("Game7", 11, 40, "Terrain1", Team1, 14, Team4, 28),
            buildGame("Game8", 11, 40, "Terrain2", Team2, 20, Team5, 16),
            buildGame("Game9", 11, 40, "Terrain3", Team7, 25, Team3, 16),
            buildGame("Game10", 12, 00, "Terrain1", Team1, 21, Team5, 22),
            buildGame("Game11", 12, 00, "Terrain2", Team6, 17, Team3, 22),
            buildGame("Game12", 12, 00, "Terrain3", Team2, 18, Team7, 23),
            buildGame("Game13", 12, 20, "Terrain1", Team3, 22, Team5, 17),
            buildGame("Game14", 12, 20, "Terrain2", Team2, 18, Team6, 23),
            buildGame("Game15", 12, 20, "Terrain3", Team4, 17, Team7, 16),
            buildGame("Game16", 12, 40, "Terrain1", Team1, 17, Team6, 20),
            buildGame("Game17", 12, 40, "Terrain2", Team2, 17, Team4, 23),
            buildGame("Game18", 12, 40, "Terrain3", Team5, 16, Team7, 21),
            buildGame("Game19", 13, 00, "Terrain1", Team1, 10, Team7, 20),
            buildGame("Game20", 13, 00, "Terrain2", Team2, 19, Team3, 19),
            buildGame("Game21", 13, 00, "Terrain3", Team4, 22, Team6, 23),
            buildGame("Game22", 14, 30, "Terrain1", Team1, 15, Team2, 24),
            buildGame("Game23", 14, 30, "Terrain2", Team3, 21, Team4, 19),
            buildGame("Game24", 14, 30, "Terrain3", Team5, 18, Team6, 24),
            buildGame("Game25", 14, 50, "Terrain1", Team1, 14, Team3, 23),
            buildGame("Game26", 14, 50, "Terrain2", Team5, 14, Team4, 23),
            buildGame("Game27", 14, 50, "Terrain3", Team6, 15, Team7, 23),
            buildGame("Game28", 15, 10, "Terrain1", Team1, 14, Team4, 23),
            buildGame("Game29", 15, 10, "Terrain2", Team2, 21, Team5, 20),
            buildGame("Game30", 15, 10, "Terrain3", Team7, 21, Team3, 18),
            buildGame("Game31", 15, 30, "Terrain1", Team1, 22, Team5, 15),
            buildGame("Game32", 15, 30, "Terrain2", Team6, 19, Team3, 22),
            buildGame("Game33", 15, 30, "Terrain3", Team2, 18, Team7, 23),
            buildGame("Game34", 15, 50, "Terrain1", Team3, 17, Team5, 16),
            buildGame("Game35", 15, 50, "Terrain2", Team2, 20, Team6, 17),
            buildGame("Game36", 15, 50, "Terrain3", Team4, 15, Team7, 20),
            buildGame("Game37", 16, 10, "Terrain1", Team1, 17, Team6, 29),
            buildGame("Game38", 16, 10, "Terrain2", Team2, 19, Team4, 19),
            buildGame("Game39", 16, 10, "Terrain3", Team5, 13, Team7, 26),
            buildGame("Game40", 16, 30, "Terrain1", Team1, 8, Team7, 22),
            buildGame("Game41", 16, 30, "Terrain2", Team2, 18, Team3, 20),
            buildGame("Game42", 16, 30, "Terrain3", Team4, 20, Team6, 17)
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
        teams.forEach(teamService::create);
        games.forEach(gameService::create);
        gameService.delete(games.get(12));
        gameService.update(buildGame("Game12", 11, 40, "Terrain7", Team1, 14, Team4, 28));
        System.out.println("Done");
        System.exit(1);
    }

    private static Game buildGame(String game1, int hour, int minute, String terrain, Team Team1, int scoreA, Team Team2,
                                    int scoreB) {
        return Game.builder()
                .id(game1)
                .time(toDate(hour, minute))
                .court(terrain)
                .contestantIds(List.of(Team1.id(), Team2.id()))
                .scoreType(ScoreType.DepthOne)
                .score(new DepthOneScore(Map.of(Team1.id(), scoreA, Team2.id(), scoreB)))
                .build();
    }

}
