package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.infrastructure.repository.jpa.model.GameEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaGameRepository extends JpaRepository<GameEntity, String> {

    boolean existsByTeamsId(String teamId);

    boolean existsByPhaseId(String phaseId);

    List<GameEntity> findByTeamsId(String teamId);

    List<GameEntity> findByGroupId(String groupId);

    List<GameEntity> findByPhaseId(String phaseId);

    List<GameEntity> findByGroupIdAndPhaseId(String groupId, String phaseId);

    List<GameEntity> findByTeamsIdAndPhaseId(String teamId, String phaseId);

}
