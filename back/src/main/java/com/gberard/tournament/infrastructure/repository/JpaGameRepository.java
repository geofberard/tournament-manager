package com.gberard.tournament.infrastructure.repository;

import com.gberard.tournament.infrastructure.repository.model.GameEntity;
import com.gberard.tournament.infrastructure.repository.model.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaGameRepository extends JpaRepository<GameEntity, String> {

}
