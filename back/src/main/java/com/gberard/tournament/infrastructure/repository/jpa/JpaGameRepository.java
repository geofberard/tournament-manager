package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.infrastructure.repository.jpa.model.GameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaGameRepository extends JpaRepository<GameEntity, String> {

}
