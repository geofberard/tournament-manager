package com.gberard.tournament.adapter.repository;

import com.gberard.tournament.domain.client.Player;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.gberard.tournament.adapter.serializer.RawUtils.getStringValue;

@Repository
public class PlayerRepository extends SheetRepository<Player> {

    @VisibleForTesting
    protected static final String RANGE = "Players!A2:B";

    public PlayerRepository() {
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
