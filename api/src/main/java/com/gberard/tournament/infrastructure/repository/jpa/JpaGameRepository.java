package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.infrastructure.repository.jpa.model.GameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaGameRepository extends JpaRepository<GameEntity, String> {

    List<GameEntity> findByTeamsId(String teamId);

    List<GameEntity> findByPool(String pool);
}
