package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.output.TeamRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.TeamEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Primary
@Repository
public class DBTeamRepository implements TeamRepository {

    private final JpaTeamRepository repository;

    public DBTeamRepository(JpaTeamRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Team> readAll() {
        return repository.findAll().stream().map(TeamEntity::toTeam).toList();
    }

    @Override
    public boolean update(Team team) {
        repository.save(TeamEntity.fromTeam(team));
        return true;
    }

    @Override
    public boolean delete(Team team) {
        repository.delete(TeamEntity.fromTeam(team));
        return true;
    }

    @Override
    public boolean deleteAll() {
        repository.deleteAll();
        return true;
    }

    @Override
    public Optional<Team> search(String id) {
        return repository.findById(id).map(TeamEntity::toTeam);
    }

}
