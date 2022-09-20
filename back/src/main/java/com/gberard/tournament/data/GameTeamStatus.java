package com.gberard.tournament.data;

public enum GameTeamStatus {
    WIN(3),
    DRAWN(1),
    LOST(0),
    NOT_PLAYED(0);

    private final int points;

    GameTeamStatus(int points) {
        this.points = points;
    }

    public int getPoints() {
        return points;
    }
}