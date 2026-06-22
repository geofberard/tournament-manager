package com.gberard.tournament.domain.exception;

public class PhaseHierarchyCycleException extends RuntimeException {

    public PhaseHierarchyCycleException(String phaseId) {
        super("Moving phase " + phaseId + " under this parent would create a hierarchy cycle");
    }
}
