package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Player;

import java.util.List;
import java.util.Optional;

public interface PlayerService {

    Player create(Player player);

    Player update(Player player);

    boolean delete(Player player);

    Optional<Player> findById(String id);

    List<Player> findAll();

}
