package com.gberard.tournament.repository;

import com.gberard.tournament.data.Team;
import com.gberard.tournament.data.TeamV1;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.gberard.tournament.data.DataUtils.*;

@Repository
public class TeamV1Repository extends SheetRepository<TeamV1> {

    @VisibleForTesting
    protected static final String RANGE = "Teams!A2:B";

    public TeamV1Repository() {
        super(RANGE);
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
