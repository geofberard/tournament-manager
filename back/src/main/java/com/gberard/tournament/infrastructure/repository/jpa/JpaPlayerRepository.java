package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.infrastructure.repository.jpa.model.PlayerEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaPlayerRepository extends JpaRepository<PlayerEntity, String> {

}
