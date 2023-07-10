package com.gberard.tournament.data;

public class TeamStatsAccumulator {
    private TeamV1 team;
    private int played = 0;
    private int won = 0;
    private int drawn = 0;
    private int lost = 0;
    private int score = 0;
    private int pointsFor = 0;
    private int pointsAgainst = 0;
    private int pointsDiff = 0;

    public TeamStatsAccumulator(TeamV1 team) {
        this.team = team;
    }

    public TeamStatsAccumulator addPlayed(int played) {
        this.played += played;
        return this;
    }

    public TeamStatsAccumulator addWon(int won) {
        this.won += won;
        return this;
    }

    public TeamStatsAccumulator addDrawn(int drawn) {
        this.drawn += drawn;
        return this;
    }

    public TeamStatsAccumulator addLost(int lost) {
        this.lost += lost;
        return this;
    }

    public TeamStatsAccumulator addScore(int score) {
        this.score += score;
        return this;
    }

    public TeamStatsAccumulator addPointsFor(int pointsFor) {
        this.pointsFor += pointsFor;
        return this;
    }

    public TeamStatsAccumulator addPointsAgainst(int pointsAgainst) {
        this.pointsAgainst += pointsAgainst;
        return this;
    }

    public TeamStatsAccumulator addPointsDiff(int pointsDiff) {
        this.pointsDiff += pointsDiff;
        return this;
    }

    public TeamStatsV1 createTeamStatistic() {
        return new TeamStatsV1(team, played, won, drawn, lost, score, pointsFor, pointsAgainst, pointsDiff);
    }

    public static TeamStatsAccumulator merge(TeamStatsAccumulator statA, TeamStatsAccumulator statB) {
        if(!statA.team.equals(statB.team)) {
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