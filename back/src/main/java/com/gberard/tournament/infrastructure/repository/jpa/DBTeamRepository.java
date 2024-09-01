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

}
