package com.gberard.tournament.data;

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
        OptionalInt scoreA,
        OptionalInt scoreB
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

        if (scoreA.getAsInt() == scoreB.getAsInt()) {
            return DRAWN;
        }

        return getPointsFor(team).getAsInt() > getPointsAgainst(team).getAsInt() ? WIN : LOST;
    }

    public boolean hasContestant(Team team) {
        return teamA.equals(team) || teamB.equals(team);
    }

    public OptionalInt getPointsFor(Team team) {
        if (!hasContestant(team)) {
            throw new IllegalStateException("Team " + team.id() + " has to played game " + this.id);
        }
        return (teamA.equals(team) ? scoreA : scoreB);
    }

    public OptionalInt getPointsAgainst(Team team) {
        if (!hasContestant(team)) {
            throw new IllegalStateException("Team " + team.id() + "has to played game " + this.id);
        }
        return (teamA.equals(team) ? scoreB : scoreA);
    }
}