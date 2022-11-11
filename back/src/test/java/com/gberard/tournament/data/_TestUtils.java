package com.gberard.tournament.data;

import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.contestant.Team;
import com.gberard.tournament.data.game.Game;

import java.time.LocalDateTime;
import java.util.List;

import static com.gberard.tournament.data.score.game.GameScore.createGameScore;
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
            .score(createGameScore(teamA, 25, teamB, 14))
            .build();

    public static Game game2 = Game.builder()
            .id("game2")
            .time(LocalDateTime.of(2022, AUGUST, 29, 11, 30))
            .court("court")
            .contestants(List.of(teamC, teamB))
            .build();

    public static Game buildGame(Contestant contestantA, int scoreA, Contestant contestantB, int scoreB) {
        return Game.builder()
                .time(LocalDateTime.now())
                .court("court")
                .contestants(List.of(teamA, teamB))
                .contestants(List.of(contestantA, contestantB))
                .score(createGameScore(contestantA, scoreA, contestantB, scoreB))
                .build();
    }

    public static List<Object> rawData(Object... values) {
        return List.of(values);
    }

}
