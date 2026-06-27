package com.gberard.tournament.domain.port.input;

import com.gberard.tournament.domain.model.stats.PhaseStatistics;

public interface PhaseStatisticsUseCase {

    PhaseStatistics getPhaseStatistics(String phaseId);
}
