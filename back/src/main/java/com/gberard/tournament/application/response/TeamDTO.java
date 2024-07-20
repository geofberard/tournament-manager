package com.gberard.tournament.application.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.gberard.tournament.domain.model.Player;

import java.util.List;

public record TeamDTO(
        String id,
        String name,
        List<Player> players) implements ContestantDTO {

    @Override
    public String getDisplayName(){
        return name;
    }
}
