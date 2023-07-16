package com.gberard.tournament.data;

public enum GameContestantStatus {
    WIN(3),
    DRAWN(1),
    LOST(0),
    NOT_PLAYED(0);

    private final int points;

    GameContestantStatus(int points) {
        this.points = points;
    }

    public int getPoints() {
        return points;
    }
}