package com.gberard.tournament.repository;

import com.gberard.tournament.data.game.Game;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.score.GameScore;
import com.gberard.tournament.data.game.score.Score;
import com.gberard.tournament.data.game.score.SetScore;
import com.google.common.annotations.VisibleForTesting;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
        fromRawScore(getValue(value, 6), contestants).ifPresent(gameBuilder::score);

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

    private GameScore fromRawGameScore(String value, List<Contestant> contestants) {
        List<String> ids = contestants.stream().map(Contestant::id).toList();
        List<Integer> points = split(value, SCORE_SEPARATOR).stream().map(Integer::parseInt).toList();

        return new GameScore(range(0, contestants.size()).boxed().collect(toMap(ids::get, points::get)));
    }

    private SetScore fromRawSetScore(String value, List<Contestant> contestants) {
        return new SetScore(Arrays.stream(value.split(GROUP_SEPARATOR))
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
                game.score().map(score -> fromRawScore(score, game.contestants())).orElse("")
        );
    }

    private String fromRawScore(Score score, List<Contestant> contestants) {
        if(score instanceof GameScore) {
            return toRawGameScore((GameScore) score, contestants);
        }

        if(score instanceof SetScore) {
            return toRawSetScore((SetScore) score, contestants);
        }

        throw new IllegalStateException("Unsupported Score Implementation : " + score.getClass());
    }

    private String toRawGameScore(GameScore score, List<Contestant> contestants) {
        return contestants.stream()
                        .map(score::getPointFor)
                        .map(points -> Integer.toString(points))
                        .collect(joining(SCORE_SEPARATOR));
    }

    private String toRawSetScore(SetScore score, List<Contestant> contestants) {
        return score.getResult().stream()
                .map(game -> toRawGameScore(game, contestants))
                .collect(joining(GROUP_SEPARATOR));
    }

}
