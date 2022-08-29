package com.gberard.tournament.data;

import lombok.Builder;
import org.apache.commons.codec.digest.DigestUtils;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.OptionalInt;

import static com.gberard.tournament.data.GameTeamStatus.*;

public record Game(
        String id,
        LocalDateTime time,
        String court,
        Team teamA,
        Team teamB,
        Optional<Team> referee,
        Optional<Integer> scoreA,
        Optional<Integer> scoreB
) {
    public boolean isFinished () {
        return scoreA.isPresent() && scoreB.isPresent();
    }

    public GameTeamStatus getTeamStatus(Team team) {
        if (!hasContestant(team)) {
            throw new IllegalStateException("Team " + team.id() + " has to played game " + this.id);
        }

        if (!isFinished()) {
            return NOT_PLAYED;
        }

        if (scoreA.get() == scoreB.get()) {
            return DRAWN;
        }

        return getPointsFor(team).get() > getPointsAgainst(team).get() ? WIN : LOST;
    }

    public boolean hasContestant(Team team) {
        return teamA.equals(team) || teamB.equals(team);
    }

    public Optional<Integer> getPointsFor(Team team) {
        if (!hasContestant(team)) {
            throw new IllegalStateException("Team " + team.id() + " has to played game " + this.id);
        }
        return (teamA.equals(team) ? scoreA : scoreB);
    }

    public Optional<Integer> getPointsAgainst(Team team) {
        if (!hasContestant(team)) {
            throw new IllegalStateException("Team " + team.id() + "has to played game " + this.id);
        }
        return (teamA.equals(team) ? scoreB : scoreA);
    }

    @Builder(builderMethodName = "builder")
    public static Game createGame(
            LocalDateTime time,
            String court,
            Team teamA,
            Team teamB,
            Team referee,
            Integer scoreA,
            Integer scoreB
    ) {
        return new Game(DigestUtils.sha1Hex(court + time.toString()), time, court, teamA, teamB,
                Optional.ofNullable(referee), Optional.ofNullable(scoreA), Optional.ofNullable(scoreB));
    }
}