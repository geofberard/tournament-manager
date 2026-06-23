package com.gberard.tournament.domain.exception;

public class PhaseHasChildrenException extends RuntimeException {

    public PhaseHasChildrenException(String phaseId) {
        super("Phase " + phaseId + " still contains child phases");
    }
}
