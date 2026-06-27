package com.gberard.tournament.domain.model;

import com.gberard.tournament.domain.model.score.SimpleScore;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class GameBuilder {
    private String id;
    private List<Phase> phasePath = List.of(new Phase("phase-default", "Phase par defaut", null, 1, PhaseType.POOL));
    private LocalDateTime time;
    private String court;
    private Long position;
    private List<Team> contestants;
    private Optional<Team> refereeId = Optional.empty();
    private GameStatus status = GameStatus.SCHEDULED;
    private Optional<SimpleScore> score = Optional.empty();

    // Constructeur privé pour forcer l'utilisation des méthodes de la classe pour initialiser le builder
    private GameBuilder() {}

    // Méthode statique pour créer un nouveau builder vide
    public static GameBuilder newBuilder() {
        return new GameBuilder();
    }

    // Méthode statique pour initialiser un builder à partir d'une instance existante de Game
    public static GameBuilder from(Game game) {
        return new GameBuilder()
                .id(game.id())
                .phasePath(game.phasePath())
                .time(game.time())
                .court(game.court())
                .position(game.position())
                .contestants(game.contestants())
                .refereeId(game.refereeId())
                .status(game.status())
                .score(game.score());
    }

    public GameBuilder id(String id) {
        this.id = id;
        return this;
    }

    public GameBuilder time(LocalDateTime time) {
        this.time = time;
        return this;
    }

    public GameBuilder phase(Phase phase) {
        this.phasePath = List.of(phase);
        return this;
    }

    public GameBuilder phasePath(List<Phase> phasePath) {
        this.phasePath = List.copyOf(phasePath);
        return this;
    }

    public GameBuilder court(String court) {
        this.court = court;
        return this;
    }

    public GameBuilder position(Long position) {
        this.position = position;
        return this;
    }

    public GameBuilder contestants(List<Team> contestants) {
        this.contestants = contestants;
        return this;
    }

    public GameBuilder refereeId(Optional<Team> refereeId) {
        this.refereeId = refereeId;
        return this;
    }

    public GameBuilder refereeId(Team refereeId) {
        this.refereeId = Optional.of(refereeId);
        return this;
    }

    public GameBuilder status(GameStatus status) {
        this.status = status;
        return this;
    }

    public GameBuilder score(Optional<SimpleScore> score) {
        this.score = score;
        this.status = score.isPresent() ? GameStatus.COMPLETED : GameStatus.SCHEDULED;
        return this;
    }

    public GameBuilder score(SimpleScore score) {
        return score(Optional.of(score));
    }

    public GameBuilder eraseScore() {
        return score(Optional.empty());
    }

    public Game build() {
        return new Game(id, phasePath, time, court, position, contestants, refereeId, status, score);
    }
}
