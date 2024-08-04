package com.gberard.tournament.application.dto;

import com.gberard.tournament.domain.model.Player;

public record CreatePlayerDTO(String firstname, String lastname) {
    public Player toPlayer() {
        return new Player(null, firstname, lastname);
    }
}
