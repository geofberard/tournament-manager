package com.gberard.tournament.application.response;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public record TeamDTO(
        String id,
        String name,
        List<String> playerIds) implements ContestantDTO {

    @Override
    public String getDisplayName(){
        return name;
    }
}
