package com.gberard.tournament.application.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PlayerDTO(
        String id,
        String firstName,
        String lastName) implements ContestantDTO {

    @Override
    public String getDisplayName(){
        return firstName + " " + lastName;
    }
}
