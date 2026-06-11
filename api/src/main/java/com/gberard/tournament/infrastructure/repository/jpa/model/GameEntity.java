package com.gberard.tournament.infrastructure.repository.jpa.model;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.infrastructure.serializer.score.DepthOneScoreRaw;
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

    @Column(name = "phase_id", nullable = false)
    private String phaseId;

    @ManyToOne(optional = false)
    @JoinColumn(name = "phase_id", referencedColumnName = "id", nullable = false, insertable = false, updatable = false)
    private PhaseEntity phase;

    @Column(name = "group_id")
    private String groupId;
    private String name;
    private String court;
    private Boolean isFinished;
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
        return new Game(
                entity.id,
                PhaseEntity.toDomain(entity.phase),
                Optional.ofNullable(entity.name),
                entity.groupId,
                entity.time,
                entity.court,
                teams,
                Optional.ofNullable(entity.referee).map(TeamEntity::toDomain),
                entity.isFinished,
                Optional.ofNullable(entity.scoreData).map(scoreData -> DepthOneScoreRaw.deserialize(scoreData, teams)));
    }

    public static GameEntity toEntity(Game game) {
        GameEntity playerEntity = new GameEntity();
        playerEntity.id = game.id();
        playerEntity.phaseId = game.phase().id();
        playerEntity.phase = PhaseEntity.toEntity(game.phase());
        playerEntity.name = game.name().orElse(null);
        playerEntity.groupId = game.group();
        playerEntity.time = game.time();
        playerEntity.court = game.court();
        playerEntity.teams = game.contestants().stream().map(TeamEntity::toEntity).toList();
        playerEntity.referee = game.refereeId().map(TeamEntity::toEntity).orElse(null);
        playerEntity.isFinished = game.isFinished();
        game.score().ifPresent(score -> playerEntity.scoreData = DepthOneScoreRaw.serialize(score, game.contestants()));
        return playerEntity;
    }

}
