package com.gberard.tournament.repository;

import com.gberard.tournament.data.game.Game;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.score.GameScore;
import com.gberard.tournament.data.game.score.Score;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.OptionalInt;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import static com.gberard.tournament.data.DataUtils.*;
import static java.util.stream.Collectors.*;
import static java.util.stream.Collectors.toList;
import static java.util.stream.IntStream.range;

@Repository
public class GameRepository extends SheetRepository<Game> {

    @VisibleForTesting
    protected static final String RANGE = "Games!A2:H";

    @Autowired
    TeamRepository teamService;

    protected GameRepository() {
        super(RANGE);
    }

    public List<Game> searchFor(Contestant team) {
        return readAll().stream()
                .filter(game -> game.hasContestant(team))
                .collect(toList());
    }

    @Override
    protected Game fromRawData(List<Object> value) {

        List<Contestant> contestants = split(getValue(value, 4), GROUP_SEPARATOR).stream()
                .map(teamService::search)
                .map(Optional::get)
                .toList();

        var gameBuilder = Game.builder()
                .id(getValue(value, 0))
                .time(parseDateTime(getValue(value, 1), getValue(value, 2)))
                .court(getValue(value, 3))
                .contestants(contestants);

        teamService.search(getValue(value, 5)).ifPresent(gameBuilder::referee);
        toRawScore(getValue(value, 6), contestants).ifPresent(gameBuilder::score);

        return gameBuilder.build();
    }

    private Optional<Score> toRawScore(String value, List<Contestant> contestants) {
        if (value.isEmpty()) {
            return Optional.empty();
        }

        List<String> ids = contestants.stream().map(Contestant::id).toList();
        List<Integer> points = split(value, SCORE_SEPARATOR).stream().map(Integer::parseInt).toList();

        return Optional.of(new GameScore(range(0, contestants.size()).boxed().collect(toMap(ids::get, points::get))));
    }

    @Override
    protected List<Object> toRawData(Game game) {
        return List.of(
                game.id(),
                formatDate(game.time()),
                formatTime(game.time()),
                game.court(),
                game.contestants().stream()
                        .map(Contestant::id)
                        .collect(joining(";")),
                game.referee().map(Contestant::id).orElse(""),
                toRawScore(game).orElse("")
        );
    }

    private Optional<String> toRawScore(Game game) {
        return game.score().map(score ->
                game.contestants().stream()
                        .map(Contestant::id)
                        .map(score::getPointFor)
                        .map(points -> Integer.toString(points))
                        .collect(joining("-"))
        );
    }

}
