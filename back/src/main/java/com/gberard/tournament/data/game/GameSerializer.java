package com.gberard.tournament.data.game;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.game.score.GameScore;
import com.gberard.tournament.data.game.score.Score;
import com.gberard.tournament.data.game.score.ScoreType;
import com.gberard.tournament.data.game.score.SetScore;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import static java.time.format.DateTimeFormatter.ISO_DATE_TIME;

public class GameSerializer extends StdSerializer<Game> {

    public GameSerializer() {
        this(null);
    }

    public GameSerializer(Class<Game> score) {
        super(score);
    }

    @Override
    public void serialize(Game game, JsonGenerator jgen, SerializerProvider provider) throws IOException {

        jgen.writeStartObject();

        jgen.writeStringField("id", game.id());
        jgen.writeStringField("time", game.time().format(ISO_DATE_TIME));
        jgen.writeStringField("court", game.court());
        jgen.writeObjectField("contestants",game.contestants());

        if (game.referee().isPresent()) {
            jgen.writeObjectField("referee",game.referee().get());
        }

        if (game.score().isPresent()) {
            jgen.writeObjectField("scoreType", getDoubleUsingSwitch(game.score().get()));
            jgen.writeObjectField("score",game.score().get());
        }

        jgen.writeEndObject();
    }

    static ScoreType getDoubleUsingSwitch(Score score) {
        return switch (score) {
            case GameScore s -> ScoreType.GameScore;
            case SetScore s -> ScoreType.SetScore;
            default -> throw new IllegalStateException("Unsupported value: " + score);
        };
    }
}