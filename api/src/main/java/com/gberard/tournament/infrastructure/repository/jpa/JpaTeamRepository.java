package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.infrastructure.repository.jpa.model.TeamEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface JpaTeamRepository extends JpaRepository<TeamEntity, String> {

}
