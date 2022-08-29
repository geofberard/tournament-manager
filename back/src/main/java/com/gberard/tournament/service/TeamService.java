package com.gberard.tournament.service;

import com.gberard.tournament.data.Team;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data.DataUtils.getValue;

@Component
public class TeamService extends SheetService<Team> {

    @VisibleForTesting
    protected static final String RANGE = "Teams!A2:B";

    public TeamService() {
        super(RANGE);
    }

    public Optional<Team> search(String teamId) {
        return readAll().stream()
                .filter(team -> team.id().equals(teamId))
                .findFirst();
    }

    @Override
    protected Team fromRawData(List<Object> rawData) {
        return new Team(getValue(rawData,0), getValue(rawData,1));
    }

    @Override
    protected List<Object> toRawData(Team team) {
        return List.of(team.id(),team.name());
    }

}
