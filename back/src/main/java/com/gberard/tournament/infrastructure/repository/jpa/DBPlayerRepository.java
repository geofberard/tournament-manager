package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.domain.model.Player;
import com.gberard.tournament.domain.port.output.PlayerRepository;
import com.gberard.tournament.infrastructure.repository.jpa.model.PlayerEntity;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Repository;

@Primary
@Repository
public class DBPlayerRepository extends DBRepository<Player, PlayerEntity> implements PlayerRepository {

    public DBPlayerRepository(JpaPlayerRepository repository) {
        super(repository, PlayerEntity::toEntity, PlayerEntity::toDomain);
    }

}
