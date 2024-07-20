package com.gberard.tournament.infrastructure.repository;

import com.gberard.tournament.infrastructure.repository.model.PlayerEntity;
import com.gberard.tournament.infrastructure.repository.model.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaTeamRepository extends JpaRepository<TeamEntity, String> {

}
