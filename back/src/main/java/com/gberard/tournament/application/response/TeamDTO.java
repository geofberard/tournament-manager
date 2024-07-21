package com.gberard.tournament.application.response;

import com.fasterxml.jackson.annotation.JsonView;
import com.gberard.tournament.domain.model.Team;

import java.util.List;

public record TeamDTO(
        String id,
        String name,
        @JsonView(Views.TeamView.Full.class)
        List<PlayerDTO> players) {

    public static TeamDTO toTeamDTO(Team team) {
        return new TeamDTO(team.id(), team.name(), team.players().stream().map(PlayerDTO::toPlayerDTO).toList());
    }
}
