package com.gberard.tournament.application.response;

import com.gberard.tournament.domain.model.Player;

public class PlayerDTOMapper {
    public static PlayerDTO toPlayerDTO(Player player){
        return new PlayerDTO(player.id(), player.firstName(), player.lastName());
    }
}
