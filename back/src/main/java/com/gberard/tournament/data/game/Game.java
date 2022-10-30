package com.gberard.tournament.data.game;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.gberard.tournament.data.Identified;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.score.Score;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data.game.ContestantResult.*;

public record Game(
        String id,
        LocalDateTime time,
        String court,
        List<Contestant> contestants,
        Optional<Contestant> referee,
        Optional<Score> score
) implements Identified {

    public boolean isFinished() {
        return score.isPresent();
    }

    public Optional<ContestantResult> getTeamStatus(Contestant contestant) {
        if (!hasContestant(contestant)) {
            throw new IllegalStateException("Team " + contestant.id() + " has to played game " + this.id);
        }

        return !isFinished() ? Optional.empty() : Optional.of(score.get().getTeamStatus(contestant.id()));
    }

    public boolean hasContestant(Contestant contestant) {
        return contestants.contains(contestant);
    }

    public Optional<Integer> getPointsFor(Contestant contestant) {
        if (!hasContestant(contestant)) {
            throw new IllegalStateException("Team " + contestant.id() + " has to played game " + this.id);
        }

        return score.map(score -> score.getPointFor(contestant.id()));
    }

    public Optional<Integer> getPointsAgainst(Contestant contestant) {
        if (!hasContestant(contestant)) {
            throw new IllegalStateException("Team " + contestant.id() + "has to played game " + this.id);
        }

        return score.map(score -> score.getPointAgainst(contestant.id()));
    }

    @Builder
    public static Game createGame(
            String id,
            LocalDateTime time,
            String court,
            List<Contestant> contestants,
            Contestant referee,
            Score score
    ) {
        return new Game(id, time, court, contestants, Optional.ofNullable(referee), Optional.ofNullable(score));
    }
}