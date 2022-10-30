package com.gberard.tournament.data;

import com.gberard.tournament.data.contestant.Contestant;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.Optional;

import static com.gberard.tournament.data.GameTeamStatus.*;

public record Game(
        String id,
        LocalDateTime time,
        String court,
        Contestant contestantA,
        Contestant contestantB,
        Optional<Contestant> referee,
        Optional<Integer> scoreA,
        Optional<Integer> scoreB
) implements Identified{
    public boolean isFinished () {
        return scoreA.isPresent() && scoreB.isPresent();
    }

    public GameTeamStatus getTeamStatus(Contestant contestant) {
        if (!hasContestant(contestant)) {
            throw new IllegalStateException("Team " + contestant.id() + " has to played game " + this.id);
        }

        if (!isFinished()) {
            return NOT_PLAYED;
        }

        if (scoreA.get() == scoreB.get()) {
            return DRAWN;
        }

        return getPointsFor(contestant).get() > getPointsAgainst(contestant).get() ? WIN : LOST;
    }

    public boolean hasContestant(Contestant contestant) {
        return contestantA.equals(contestant) || contestantB.equals(contestant);
    }

    public Optional<Integer> getPointsFor(Contestant contestant) {
        if (!hasContestant(contestant)) {
            throw new IllegalStateException("Team " + contestant.id() + " has to played game " + this.id);
        }
        return (contestantA.equals(contestant) ? scoreA : scoreB);
    }

    public Optional<Integer> getPointsAgainst(Contestant contestant) {
        if (!hasContestant(contestant)) {
            throw new IllegalStateException("Team " + contestant.id() + "has to played game " + this.id);
        }
        return (contestantA.equals(contestant) ? scoreB : scoreA);
    }

    @Builder
    public static Game createGame(
            String id,
            LocalDateTime time,
            String court,
            Contestant contestantA,
            Contestant contestantB,
            Contestant referee,
            Integer scoreA,
            Integer scoreB
    ) {
        return new Game(id, time, court, contestantA, contestantB,
                Optional.ofNullable(referee), Optional.ofNullable(scoreA), Optional.ofNullable(scoreB));
    }
}