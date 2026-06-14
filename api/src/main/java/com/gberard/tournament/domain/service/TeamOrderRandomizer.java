package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Team;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Random;

@Component
public class TeamOrderRandomizer {

    private final Random random;

    public TeamOrderRandomizer() {
        this(new Random());
    }

    TeamOrderRandomizer(Random random) {
        this.random = Objects.requireNonNull(random, "random must not be null");
    }

    public List<Team> shuffle(List<Team> teams) {
        Objects.requireNonNull(teams, "teams must not be null");
        List<Team> shuffledTeams = new ArrayList<>(teams);
        Collections.shuffle(shuffledTeams, random);
        return List.copyOf(shuffledTeams);
    }
}
