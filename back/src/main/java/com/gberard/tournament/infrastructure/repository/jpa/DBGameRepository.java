package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Game;
import com.gberard.tournament.domain.port.output.GameRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.GameEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Primary
@Repository
public class DBGameRepository extends DBRepository<Game, GameEntity> implements GameRepository {

    public DBGameRepository(JpaGameRepository repository) {
        super(repository, GameEntity::toEntity, GameEntity::toDomain);
    }

}
