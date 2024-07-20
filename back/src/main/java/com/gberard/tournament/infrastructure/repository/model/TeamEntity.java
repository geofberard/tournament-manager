package com.gberard.tournament.infrastructure.repository.model;

import com.gberard.tournament.domain.model.Player;
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

    public Team toTeam() {
        return new Team(id, name, players.stream()
                .map(PlayerEntity::toPlayer)
                .toList());
    }

    public static TeamEntity fromTeam(Team team) {
        TeamEntity playerEntity = new TeamEntity();
        playerEntity.id = team.id();
        playerEntity.name = team.name();
        return playerEntity;
    }

}
