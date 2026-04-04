package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.Team;

import java.util.List;
import java.util.Optional;

public interface TeamService {

    Team create(Team team);

    Team update(Team team);

    boolean delete(Team team);

    Optional<Team> findById(String id);

    List<Team> findAll();

}
