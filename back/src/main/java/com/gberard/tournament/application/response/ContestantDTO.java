package com.gberard.tournament.application.response;

import com.fasterxml.jackson.annotation.JsonProperty;

public interface ContestantDTO {

    @JsonProperty("displayName")
    String getDisplayName();

}
