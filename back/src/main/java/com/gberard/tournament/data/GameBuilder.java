package com.gberard.tournament.data;

import org.apache.commons.codec.digest.DigestUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.OptionalInt;

public class GameBuilder {
    private LocalDateTime time;
    private String court;
    private Team teamA;
    private Team teamB;
    private Optional<Team> referee = Optional.empty();
    private OptionalInt scoreA = OptionalInt.empty();
    private OptionalInt scoreB = OptionalInt.empty();

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

    public GameBuilder setScoreA(int scoreA) {
        return setScoreA(OptionalInt.of(scoreA));
    }

    public GameBuilder setScoreB(OptionalInt scoreB) {
        this.scoreB = scoreB;
        return this;
    }

    public GameBuilder setScoreB(int scoreB) {
        return setScoreB(OptionalInt.of(scoreB));
    }

    public Game createGame() {
        return new Game(DigestUtils.sha1Hex(court + time.toString()), time, court, teamA, teamB, referee, scoreA, scoreB);
    }
}