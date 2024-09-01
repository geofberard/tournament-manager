package com.gberard.tournament.infrastructure.repository.jpa.model;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.model.score.ScoreType;
import com.gberard.tournament.infrastructure.serializer.score.ScoreRaw;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Entity(name = "game")
@Table(name = "games")
public class GameEntity {

    @Id
    String id;

    @Column(name = "time")
    private LocalDateTime time;

    private String court;
    private Boolean isFinished;
    private String scoreType;
    private String scoreData;

    @OneToMany
    @JoinTable(
            name = "game_teams",
            joinColumns = @JoinColumn(name = "game_id"),
            inverseJoinColumns = @JoinColumn(name = "team_id")
    )
    private List<TeamEntity> teams;

    @ManyToOne
    @JoinColumn(name = "referee_id", referencedColumnName = "id", nullable = true)
    private TeamEntity referee;


    @PrePersist
    public void generateUUID() {
        if (this.id == null) {
            this.id = "game_" + UUID.randomUUID();
        }
    }

    public static Game toDomain(GameEntity entity) {
        List<Team> teams = entity.teams.stream().map(TeamEntity::toDomain).toList();
        ScoreType type = ScoreType.valueOf(entity.scoreType);
        return new Game(
                entity.id,
                entity.time,
                entity.court,
                teams,
                Optional.ofNullable(entity.referee).map(TeamEntity::toDomain),
                entity.isFinished,
                type,
                Optional.ofNullable(ScoreRaw.getScoreDeserializer(teams, type).apply(entity.scoreData)));
    }

    public static GameEntity toEntity(Game game) {
        GameEntity playerEntity = new GameEntity();
        playerEntity.id = game.id();
        playerEntity.time = game.time();
        playerEntity.court = game.court();
        playerEntity.teams = game.contestants().stream().map(TeamEntity::toEntity).toList();
        playerEntity.referee = null;
        playerEntity.isFinished = game.isFinished();
        playerEntity.scoreType = game.scoreType().name();
        game.score().ifPresent(score -> playerEntity.scoreData = ScoreRaw.getScoreSerializer(game).apply(score));
        return playerEntity;
    }

}
