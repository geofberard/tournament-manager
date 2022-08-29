package com.gberard.tournament;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.service.GameService;
import com.gberard.tournament.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDateTime;

import static java.time.Month.AUGUST;

@SpringBootApplication
public class BackofficeSandboxApplication {
    @Autowired
    private TeamService teamService;

    @Autowired
    private GameService gameService;

    public static void main(String[] args) {
        SpringApplication.run(BackofficeSandboxApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() {
        teamService.addTeam(new Team("yeah","DepartYeah"));
        gameService.addGame(Game.builder()
                .time(LocalDateTime.of(2022, AUGUST,29,10,30))
                .court("test")
                .teamA(new Team("TeamA",""))
                .teamB(new Team("TeamB",""))
                .referee(new Team("TeamC",""))
                .scoreA(25)
                .scoreB(14)
                .build());
        gameService.addGame(Game.builder()
                .time(LocalDateTime.of(2022, AUGUST,29,10,30))
                .court("test")
                .teamA(new Team("TeamA",""))
                .teamB(new Team("TeamB",""))
                .build());
        System.out.println(teamService.getTeam("yeah"));
        System.out.println("Done");
    }

}
