package com.gberard.tournament.application.response;

import com.gberard.tournament.domain.model.Team;

public class TeamDTOMapper {
    public static TeamDTO toTeamDTO(Team team){
        return new TeamDTO(team.id(), team.name(), team.players());
    }
}
