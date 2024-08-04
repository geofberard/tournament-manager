package com.gberard.tournament.application.dto;

import com.gberard.tournament.domain.model.Player;

public record UpdatePlayerDTO(String firstname, String lastname) {
    public Player toPlayer(String id) {
        return new Player(id, firstname, lastname);
    }
}
