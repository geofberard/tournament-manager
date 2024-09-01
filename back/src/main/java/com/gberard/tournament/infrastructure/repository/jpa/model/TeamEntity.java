package com.gberard.tournament.infrastructure.repository.jpa.model;

import com.gberard.tournament.domain.model.Team;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity(name = "team")
@Table(name = "teams")
public class TeamEntity {

    @Id
    String id;

    String name;

    @OneToMany
    @JoinTable(
            name = "team_players",
            joinColumns = @JoinColumn(name = "team_id"),
            inverseJoinColumns = @JoinColumn(name = "player_id")
    )
    private List<PlayerEntity> players;

    @PrePersist
    public void generateUUID() {
        if (this.id == null) {
            this.id = "team_" + UUID.randomUUID();
        }
    }

    public static Team toDomain(TeamEntity teamEntity) {
        return new Team(teamEntity.id, teamEntity.name, teamEntity.players.stream()
                .map(PlayerEntity::toDomain)
                .toList());
    }

    public static TeamEntity toEntity(Team team) {
        TeamEntity playerEntity = new TeamEntity();
        playerEntity.id = team.id();
        playerEntity.name = team.name();
        playerEntity.players = team.players().stream()
                .map(PlayerEntity::toEntity)
                .toList();
        return playerEntity;
    }

}
