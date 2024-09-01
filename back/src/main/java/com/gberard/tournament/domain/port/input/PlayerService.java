package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Player;

import java.util.List;
import java.util.Optional;

public interface PlayerService {

    List<Player> findAll();

    Optional<Player> findById(String id);

    Player create(String firstName, String lastName);

    Player update(String id, String firstName, String lastName);

    boolean delete(String id);

}
