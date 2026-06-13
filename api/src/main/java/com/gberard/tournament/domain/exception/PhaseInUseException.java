package com.gberard.tournament.domain.exception;

public class PhaseInUseException extends RuntimeException {

    public PhaseInUseException(String phaseId) {
        super("Phase " + phaseId + " is still referenced by existing games");
    }
}
