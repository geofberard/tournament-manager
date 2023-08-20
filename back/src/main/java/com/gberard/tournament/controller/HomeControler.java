package com.gberard.tournament.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class HomeControler {

    @GetMapping("/")
    public String home() {
        return "Hello World !";
    }

}
