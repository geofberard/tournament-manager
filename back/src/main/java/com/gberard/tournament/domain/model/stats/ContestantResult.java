package com.gberard.tournament.domain.model.stats;

public enum ContestantResult {
    WIN(3),
    DRAWN(1),
    LOST(0);

    private final int points;

    ContestantResult(int points) {
        this.points = points;
    }

    public int getPoints() {
        return points;
    }
}
