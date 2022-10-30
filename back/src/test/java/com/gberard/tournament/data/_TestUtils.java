package com.gberard.tournament.data;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.contestant.Team;
import com.gberard.tournament.data.game.Game;
import com.gberard.tournament.data.game.score.GameScore;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static java.time.Month.AUGUST;

public class _TestUtils {

    public static Contestant teamA = new Team("teamA", "TeamA");
    public static Contestant teamB = new Team("teamB", "TeamB");
    public static Contestant teamC = new Team("teamC", "TeamC");
    public static Contestant teamD = new Team("teamD", "TeamD");
    public static Contestant teamE = new Team("teamE", "TeamE");

    public static Game game1 = Game.builder()
            .id("game1")
            .time(LocalDateTime.of(2022, AUGUST, 29, 10, 30))
            .court("court")
            .contestants(List.of(teamA,teamB))
            .referee(teamC)
            .score(buildGameScore(teamA.id(), 25,teamB.id(), 14))
            .build();

    public static Game game2 = Game.builder()
            .id("game2")
            .time(LocalDateTime.of(2022, AUGUST, 29, 11, 30))
            .court("court")
            .contestants(List.of(teamC,teamB))
            .build();

    public static Game.GameBuilder gameBuilder() {
        return Game.builder()
                .time(LocalDateTime.now())
                .court("court")
                .contestants(List.of(teamA,teamB));
    }

    public static Game buildGame(Contestant contestantA, int scoreA, Contestant contestantB, int scoreB) {
        return gameBuilder()
                .contestants(List.of(contestantA,contestantB))
                .score(buildGameScore(contestantA.id(), scoreA, contestantB.id(), scoreB))
                .build();
    }

    public static GameScore buildGameScore(String contestantIdA, int scoreA, String contestantIdB, int scoreB)  {
        return new GameScore(Map.of(contestantIdA,scoreA,contestantIdB,scoreB));
    }

    public static List<Object> rawData(Object...values) {
        return List.of(values);
    }

}
