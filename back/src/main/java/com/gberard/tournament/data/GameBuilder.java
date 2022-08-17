package com.gberard.tournament.data;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.OptionalInt;

public class GameBuilder {
    private LocalDateTime time;
    private String court;
    private Team teamA;
    private Team teamB;
    private Optional<Team> referee;
    private OptionalInt scoreA;
    private OptionalInt scoreB;

    public GameBuilder setTime(LocalDateTime time) {
        this.time = time;
        return this;
    }

    public GameBuilder setCourt(String court) {
        this.court = court;
        return this;
    }

    public GameBuilder setTeamA(Team teamA) {
        this.teamA = teamA;
        return this;
    }

    public GameBuilder setTeamB(Team teamB) {
        this.teamB = teamB;
        return this;
    }

    public GameBuilder setReferee(Optional<Team> referee) {
        this.referee = referee;
        return this;
    }

    public GameBuilder setScoreA(OptionalInt scoreA) {
        this.scoreA = scoreA;
        return this;
    }

    public GameBuilder setScoreB(OptionalInt scoreB) {
        this.scoreB = scoreB;
        return this;
    }

    public Game createGame() {
        return new Game(court + time.toString(), time, court, teamA, teamB, referee, scoreA, scoreB);
    }
}