package com.gberard.tournament.infrastructure.repository.jpa;

import com.gberard.tournament.infrastructure.repository.jpa.model.PhaseEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JpaPhaseRepository extends JpaRepository<PhaseEntity, String> {

    List<PhaseEntity> findAllByOrderByDisplayOrderAsc();
}
