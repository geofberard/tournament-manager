package com.gberard.tournament.application.dto;

import com.gberard.tournament.domain.model.Player;

public record PlayerDTO(
        String id,
        String firstName,
        String lastName) {
    public static PlayerDTO toPlayerDTO(Player player){
        return new PlayerDTO(player.id(), player.firstName(), player.lastName());
    }
}
