package com.gberard.tournament.data;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.contestant.Team;
import com.gberard.tournament.data.game.Game;
import com.gberard.tournament.data.game.score.GameScore;
import com.gberard.tournament.data.game.score.SetScore;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

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
            .contestants(List.of(teamA, teamB))
            .referee(teamC)
            .score(buildGameScore(teamA, 25, teamB, 14))
            .build();

    public static Game game2 = Game.builder()
            .id("game2")
            .time(LocalDateTime.of(2022, AUGUST, 29, 11, 30))
            .court("court")
            .contestants(List.of(teamC, teamB))
            .build();

    public static Game.GameBuilder gameBuilder() {
        return Game.builder()
                .time(LocalDateTime.now())
                .court("court")
                .contestants(List.of(teamA, teamB));
    }

    public static Game buildGame(Contestant contestantA, int scoreA, Contestant contestantB, int scoreB) {
        return gameBuilder()
                .contestants(List.of(contestantA, contestantB))
                .score(buildGameScore(contestantA, scoreA, contestantB, scoreB))
                .build();
    }

    public static GameScore buildGameScore(Contestant contestA, int scoreA, Contestant contestB, int scoreB) {
        return new GameScore(Map.of(contestA.id(), scoreA, contestB.id(), scoreB));
    }

    public static SetScore buildSetScore(Contestant contestA, List<Integer> scoreA, Contestant contestB, List<Integer> scoreB) {
        if (scoreA.size() != scoreB.size()) {
            throw new IllegalStateException("Teams cannot have different number of scores");
        }

        return new SetScore(IntStream.range(0, scoreA.size())
                .mapToObj(index -> Map.of(contestA.id(), scoreA.get(index), contestB.id(), scoreB.get(index)))
                .map(GameScore::new)
                .toList());
    }

    public static List<Object> rawData(Object... values) {
        return List.of(values);
    }

}
