package com.gberard.tournament.repository;

import com.gberard.tournament.data.client.Team;
import com.gberard.tournament.serializer.ListRaw;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.gberard.tournament.serializer.RawUtils.*;

@Repository
public class TeamRepository extends SheetRepository<Team> {

    @VisibleForTesting
    protected static final String RANGE = "Teams!A2:C";

    public TeamRepository() {
        super(RANGE);
    }

    @Override
    protected Team fromRawData(List<Object> rawData) {
        return new Team(
                getStringValue(rawData,0).get(),
                getStringValue(rawData,1).get(),
                getValue(rawData, 2, ListRaw::deserialize).orElse(List.of())
        );
    }

    @Override
    protected List<Object> toRawData(Team team) {
        return List.of(team.id(),team.name(), ListRaw.serialize(team.playerIds()));
    }

}
