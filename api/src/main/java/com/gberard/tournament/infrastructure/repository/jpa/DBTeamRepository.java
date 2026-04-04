package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Team;
import com.gberard.tournament.domain.port.output.TeamRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.TeamEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Primary
@Repository
public class DBTeamRepository extends DBRepository<Team, TeamEntity> implements TeamRepository {

    public DBTeamRepository(JpaTeamRepository repository) {
        super(repository, TeamEntity::toEntity, TeamEntity::toDomain);
    }

    @Override
    public java.util.List<Team> findAll() {
        return findAllMapped();
    }

    @Override
    public java.util.Optional<Team> findById(String id) {
        return findByIdMapped(id);
    }

    @Override
    public Team save(Team team) {
        return saveMapped(team);
    }

    @Override
    public void deleteById(String id) {
        deleteByIdMapped(id);
    }

}
