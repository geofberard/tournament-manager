package com.gberard.tournament.repository;

import com.gberard.tournament.data.TeamV1;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data.DataUtils.getValue;

@Repository
public class TeamRepository extends SheetRepository<TeamV1> {

    @VisibleForTesting
    protected static final String RANGE = "Teams!A2:B";

    public TeamRepository() {
        super(RANGE);
    }

    public Optional<TeamV1> search(String teamId) {
        return readAll().stream()
                .filter(team -> team.id().equals(teamId))
                .findFirst();
    }

    @Override
    protected TeamV1 fromRawData(List<Object> rawData) {
        return new TeamV1(getValue(rawData,0), getValue(rawData,1));
    }

    @Override
    protected List<Object> toRawData(TeamV1 team) {
        return List.of(team.id(),team.name());
    }

}
