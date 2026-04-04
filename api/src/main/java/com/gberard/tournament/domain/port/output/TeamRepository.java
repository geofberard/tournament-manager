package com.gberard.tournament.domain.port.output;

import com.gberard.tournament.domain.model.Team;

import java.util.List;
import java.util.Optional;

public interface TeamRepository {

    List<Team> findAll();

    Optional<Team> findById(String id);

    Team save(Team team);

    void deleteById(String id);
}
