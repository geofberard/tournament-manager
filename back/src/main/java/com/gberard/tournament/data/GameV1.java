package com.gberard.tournament.data;

import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.gberard.tournament.data.GameTeamStatus.*;

public record GameV1(
        String id,
        LocalDateTime time,
        String court,
        TeamV1 teamA,
        TeamV1 teamB,
        Optional<TeamV1> referee,
        Optional<Integer> scoreA,
        Optional<Integer> scoreB
) implements Identified{
    public boolean isFinished () {
        return scoreA.isPresent() && scoreB.isPresent();
    }

    public GameTeamStatus getTeamStatus(TeamV1 team) {
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

    public boolean hasContestant(TeamV1 team) {
        return teamA.equals(team) || teamB.equals(team);
    }

    public Optional<Integer> getPointsFor(TeamV1 team) {
        if (!hasContestant(team)) {
            throw new IllegalStateException("Team " + team.id() + " has to played game " + this.id);
        }
        return (teamA.equals(team) ? scoreA : scoreB);
    }

    public Optional<Integer> getPointsAgainst(TeamV1 team) {
        if (!hasContestant(team)) {
            throw new IllegalStateException("Team " + team.id() + "has to played game " + this.id);
        }
        return (teamA.equals(team) ? scoreB : scoreA);
    }

    @Builder
    public static GameV1 createGame(
            String id,
            LocalDateTime time,
            String court,
            TeamV1 teamA,
            TeamV1 teamB,
            TeamV1 referee,
            Integer scoreA,
            Integer scoreB
    ) {
        return new GameV1(id, time, court, teamA, teamB,
                Optional.ofNullable(referee), Optional.ofNullable(scoreA), Optional.ofNullable(scoreB));
    }
}