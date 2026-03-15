package com.gberard.tournament.application.mapper;

import java.util.ArrayList;

import com.gberard.tournament.generated.model.CreateTeamRequest;
import com.gberard.tournament.generated.model.UpdateTeamRequest;

public final class TeamMapper {

    public static com.gberard.tournament.generated.model.Team toApi(com.gberard.tournament.domain.model.Team team) {
        return new com.gberard.tournament.generated.model.Team()
                .id(team.id())
                .name(team.name());
    }

    public static com.gberard.tournament.domain.model.Team toDomain(CreateTeamRequest request) {
        return new com.gberard.tournament.domain.model.Team(null, request.getName(), new ArrayList<>());
    }

    public static com.gberard.tournament.domain.model.Team toDomain(String id, UpdateTeamRequest request) {
        return new com.gberard.tournament.domain.model.Team(id, request.getName(), new ArrayList<>());
    }
}
