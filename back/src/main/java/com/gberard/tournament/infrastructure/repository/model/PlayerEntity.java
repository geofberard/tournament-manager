package com.gberard.tournament.infrastructure.repository.model;

import com.gberard.tournament.domain.model.Player;
import jakarta.persistence.*;

import java.util.UUID;

@Entity(name = "player")
@Table(name = "players")
public class PlayerEntity {

    @Id
    String id;

    String firstName;

    String lastName;

    @PrePersist
    public void generateUUID() {
        if (this.id == null) {
            this.id = "player_" + UUID.randomUUID();
        }
    }

    public Player toPlayer() {
        return new Player(id, firstName, lastName);
    }

    public static PlayerEntity fromPlayer(Player player) {
        PlayerEntity playerEntity = new PlayerEntity();
        playerEntity.id = player.id();
        playerEntity.firstName = player.firstName();
        playerEntity.lastName = player.lastName();
        return playerEntity;
    }

}
