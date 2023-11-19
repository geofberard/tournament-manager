package com.gberard.tournament.domain.model.stats;

public class ContestantStatsAccumulator {
    private String contestantId;
    private int played = 0;
    private int won = 0;
    private int drawn = 0;
    private int lost = 0;
    private int score = 0;
    private int pointsFor = 0;
    private int pointsAgainst = 0;
    private int pointsDiff = 0;

    public ContestantStatsAccumulator(String contestantId) {
        this.contestantId = contestantId;
    }

    public ContestantStatsAccumulator addPlayed(int played) {
        this.played += played;
        return this;
    }

    public ContestantStatsAccumulator addWon(int won) {
        this.won += won;
        return this;
    }

    public ContestantStatsAccumulator addDrawn(int drawn) {
        this.drawn += drawn;
        return this;
    }

    public ContestantStatsAccumulator addLost(int lost) {
        this.lost += lost;
        return this;
    }

    public ContestantStatsAccumulator addScore(int score) {
        this.score += score;
        return this;
    }

    public ContestantStatsAccumulator addPointsFor(int pointsFor) {
        this.pointsFor += pointsFor;
        return this;
    }

    public ContestantStatsAccumulator addPointsAgainst(int pointsAgainst) {
        this.pointsAgainst += pointsAgainst;
        return this;
    }

    public ContestantStatsAccumulator addPointsDiff(int pointsDiff) {
        this.pointsDiff += pointsDiff;
        return this;
    }

    public ContestantStats create() {
        return new ContestantStats(contestantId, played, won, drawn, lost, score, pointsFor, pointsAgainst, pointsDiff);
    }

    public static ContestantStatsAccumulator merge(ContestantStatsAccumulator statA, ContestantStatsAccumulator statB) {
        if(!statA.contestantId.equals(statB.contestantId)) {
            throw new IllegalStateException("Impossible to merge stats from different teams");
        }
        return statA.addPlayed(statB.played)
                .addWon(statB.won)
                .addLost(statB.lost)
                .addDrawn(statB.drawn)
                .addScore(statB.score)
                .addPointsFor(statB.pointsFor)
                .addPointsAgainst(statB.pointsAgainst)
                .addPointsDiff(statB.pointsDiff);
    }
}
