package com.gberard.tournament.repository;

import com.gberard.tournament.data.game.Game;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.score.onelevel.OneLevelScore;
import com.gberard.tournament.data.score.Score;
import com.gberard.tournament.data.score.twolevel.TwoLevelScore;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static com.gberard.tournament.data.DataUtils.*;
import static com.gberard.tournament.data.score.ScoreUtils.*;
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

        String scoreType = getValue(value, 6);
        scoreFromJson(getValue(value, 7), scoreType).ifPresent(gameBuilder::score);

        return gameBuilder.build();
    }

    private Optional<Score> fromRawScore(String value, List<Contestant> contestants) {
        if (value.isEmpty()) {
            return Optional.empty();
        }

        if (value.contains(GROUP_SEPARATOR)) {
            return Optional.of(fromRawSetScore(value, contestants));
        }

        if (value.contains(SCORE_SEPARATOR)) {
            return Optional.of(fromRawGameScore(value, contestants));
        }

        throw new IllegalStateException("Unsupported Score Implementation : " + value);
    }

    private OneLevelScore fromRawGameScore(String value, List<Contestant> contestants) {
        List<String> ids = contestants.stream().map(Contestant::id).toList();
        List<Integer> points = split(value, SCORE_SEPARATOR).stream().map(Integer::parseInt).toList();

        return new OneLevelScore(range(0, contestants.size()).boxed().collect(toMap(ids::get, points::get)));
    }

    private TwoLevelScore fromRawSetScore(String value, List<Contestant> contestants) {
        return new TwoLevelScore(Arrays.stream(value.split(GROUP_SEPARATOR))
                .map(element -> fromRawGameScore(element, contestants))
                .toList());
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
                        .collect(joining(GROUP_SEPARATOR)),
                game.referee().map(Contestant::id).orElse(""),
                game.score().map(score -> getScoreType(score)).orElse(""),
                game.score().map(score -> scoreToJson(score).orElse("")).orElse("")
        );
    }

}
