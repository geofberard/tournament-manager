package com.gberard.tournament.domain.model;

import com.gberard.tournament.domain.model.score.SimpleScore;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

public final class Game implements Identified {
    private final String id;
    private final List<Phase> phasePath;
    private final Optional<String> subgroup;
    private final String group;
    private final LocalDateTime time;
    private final String court;
    private final Long position;
    private final List<Team> contestants;
    private final Optional<Team> refereeId;
    private final GameStatus status;
    private final Optional<SimpleScore> score;

    public Game(
            String id,
            Phase phase,
            Optional<String> subgroup,
            String group,
            LocalDateTime time,
            String court,
            Long position,
            List<Team> contestants,
            Optional<Team> refereeId,
            GameStatus status,
            Optional<SimpleScore> score
    ) {
        this(id, List.of(phase), subgroup, group, time, court, position, contestants, refereeId, status, score);
    }

    public Game(
            String id,
            List<Phase> phasePath,
            Optional<String> subgroup,
            String group,
            LocalDateTime time,
            String court,
            Long position,
            List<Team> contestants,
            Optional<Team> refereeId,
            GameStatus status,
            Optional<SimpleScore> score
    ) {
        this.id = id;
        this.phasePath = List.copyOf(Objects.requireNonNull(phasePath, "phasePath must not be null"));
        if (this.phasePath.isEmpty()) {
            throw new IllegalArgumentException("phasePath must not be empty");
        }
        this.subgroup = Objects.requireNonNull(subgroup, "subgroup must not be null");
        this.group = Objects.requireNonNull(group, "group must not be null");
        this.time = time;
        this.court = Objects.requireNonNull(court, "court must not be null");
        this.position = position;
        this.contestants = List.copyOf(Objects.requireNonNull(contestants, "contestants must not be null"));
        this.refereeId = Objects.requireNonNull(refereeId, "refereeId must not be null");
        this.status = Objects.requireNonNull(status, "status must not be null");
        this.score = Objects.requireNonNull(score, "score must not be null");
    }

    @Override
    public String id() {
        return id;
    }

    public LocalDateTime time() {
        return time;
    }

    public Phase phase() {
        return phasePath.getLast();
    }

    public List<Phase> phasePath() {
        return phasePath;
    }

    public String group() {
        return group;
    }

    public Optional<String> subgroup() {
        return subgroup;
    }

    public String court() {
        return court;
    }

    public Long position() {
        return position;
    }

    public List<Team> contestants() {
        return contestants;
    }

    public Optional<Team> refereeId() {
        return refereeId;
    }

    public GameStatus status() {
        return status;
    }

    public Optional<SimpleScore> score() {
        return score;
    }

    public Game withScore(SimpleScore newScore) {
        return new Game(id, phasePath, subgroup, group, time, court, position, contestants, refereeId, GameStatus.COMPLETED, Optional.of(newScore));
    }

    public Game withoutScore() {
        return new Game(id, phasePath, subgroup, group, time, court, position, contestants, refereeId, GameStatus.SCHEDULED, Optional.empty());
    }

    @Override
    public boolean equals(Object other) {
        if (this == other) {
            return true;
        }
        if (!(other instanceof Game game)) {
            return false;
        }
        return Objects.equals(id, game.id)
                && Objects.equals(phasePath, game.phasePath)
                && Objects.equals(subgroup, game.subgroup)
                && Objects.equals(group, game.group)
                && Objects.equals(time, game.time)
                && Objects.equals(court, game.court)
                && Objects.equals(position, game.position)
                && Objects.equals(contestants, game.contestants)
                && Objects.equals(refereeId, game.refereeId)
                && status == game.status
                && Objects.equals(score, game.score);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, phasePath, subgroup, group, time, court, position, contestants, refereeId, status, score);
    }

    @Override
    public String toString() {
        return "Game[" +
                "id=" + id +
                ", phasePath=" + phasePath +
                ", subgroup=" + subgroup +
                ", group=" + group +
                ", time=" + time +
                ", court=" + court +
                ", position=" + position +
                ", contestants=" + contestants +
                ", refereeId=" + refereeId +
                ", status=" + status +
                ", score=" + score +
                ']';
    }
}
