package com.gberard.tournament.domain.exception;

public class TeamInUseException extends RuntimeException {

    private final String teamId;

    public TeamInUseException(String teamId) {
        super("Team " + teamId + " is still referenced by existing games");
        this.teamId = teamId;
    }

    public String teamId() {
        return teamId;
    }
}
