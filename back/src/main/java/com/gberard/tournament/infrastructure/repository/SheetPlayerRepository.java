package com.gberard.tournament.infrastructure.repository;

import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.port.output.PlayerRepository;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.gberard.tournament.infrastructure.serializer.RawUtils.getStringValue;

@Repository
public class SheetPlayerRepository extends SheetRepository<Player> implements PlayerRepository {

    @VisibleForTesting
    protected static final String RANGE = "Players!A2:B";

    public SheetPlayerRepository() {
        super(RANGE);
    }

    @Override
    protected Player fromRawData(List<Object> rawData) {
        return new Player(
                getStringValue(rawData, 0).get(),
                getStringValue(rawData, 1).get(),
                getStringValue(rawData, 2).get()
        );
    }

    @Override
    protected List<Object> toRawData(Player player) {
        return List.of(player.id(), player.firstName(), player.lastName());
    }

}
