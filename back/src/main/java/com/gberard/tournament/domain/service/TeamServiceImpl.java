package com.gberard.tournament.domain.service;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.input.TeamService;
import com.gberard.tournament.domain.port.output.TeamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeamServiceImpl implements TeamService {

    @Autowired
    public TeamRepository teamRepository;

    @Override
    public Team create(Team player) {
        return teamRepository.create(player);
    }

    @Override
    public Team update(Team player) {
        return teamRepository.update(player);
    }

    @Override
    public boolean delete(Team player) {
        return teamRepository.delete(player);
    }

    @Override
    public Optional<Team> findById(String id) {
        return teamRepository.search(id);
    }

    @Override
    public List<Team> findAll() {
        return teamRepository.readAll();
    }
}
