package com.gberard.tournament.controller;

import com.gberard.tournament.data.Team;
import com.gberard.tournament.service.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class HelloWorldController {

    @Autowired
    public TeamService teamService;

    @GetMapping("/")
    public String getTeams() {
        return "Hello World";
    }

    @GetMapping("/happy")
    public String hello() {
        return "Hello World !!!!!!";
    }

}
