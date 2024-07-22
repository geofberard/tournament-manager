package com.gberard.tournament.infrastructure.repository.googlesheet;

import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.infrastructure.serializer.ListRaw;
import com.gberard.tournament.domain.port.output.TeamRepository;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.gberard.tournament.infrastructure.serializer.RawUtils.*;

@Repository
public class SheetTeamRepository extends SheetRepository<Team> implements TeamRepository {

    @VisibleForTesting
    protected static final String RANGE = "Teams!A2:C";

    public SheetTeamRepository() {
        super(RANGE);
    }

    @Override
    protected Team fromRawData(List<Object> rawData) {
        return new Team(
                getStringValue(rawData,0).get(),
                getStringValue(rawData,1).get(),
                List.of()//getValue(rawData, 2, ListRaw::deserialize).orElse(List.of())
        );
    }

    @Override
    protected List<Object> toRawData(Team team) {
        return List.of(team.id(),team.name(), ListRaw.serialize(team.players().stream().map(Player::id).toList()));
    }

}
