package com.gberard.tournament;

import com.gberard.tournament.data.Game;
import com.gberard.tournament.data.Team;
import com.gberard.tournament.repository.GameRepository;
import com.gberard.tournament.repository.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.time.LocalDateTime;

import static java.time.Month.AUGUST;

//Remove comments before usage
//@SpringBootApplication
public class BackofficeSandboxApplication {
    @Autowired
    private TeamRepository teamService;

    @Autowired
    private GameRepository gameService;

    public static void main(String[] args) {
        SpringApplication.run(BackofficeSandboxApplication.class, args);
    }

    @EventListener(ApplicationReadyEvent.class)
    public void doSomethingAfterStartup() {
        teamService.deleteAll();
        gameService.deleteAll();
        teamService.create(new Team("TeamA","TeamA"));
        teamService.create(new Team("TeamB","TeamB"));
        teamService.create(new Team("TeamC","TeamC"));
        gameService.create(Game.builder()
                .id("game1")
                .time(LocalDateTime.of(2022, AUGUST,29,10,30))
                .court("test")
                .teamA(new Team("TeamA",""))
                .teamB(new Team("TeamB",""))
                .referee(new Team("TeamC",""))
                .scoreA(25)
                .scoreB(14)
                .build());
        gameService.create(Game.builder()
                .id("game2")
                .time(LocalDateTime.of(2022, AUGUST,29,10,30))
                .court("test")
                .teamA(new Team("TeamA",""))
                .teamB(new Team("TeamB",""))
                .build());
        System.out.println(teamService.search("TeamA"));
        System.out.println("Done");
        System.exit(1);
    }

}
