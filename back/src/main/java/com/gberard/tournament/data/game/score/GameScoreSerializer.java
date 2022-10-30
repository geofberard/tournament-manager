package com.gberard.tournament.data.game.score;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.gberard.tournament.data.game.Game;

import java.io.IOException;
import java.util.Map;

public class GameScoreSerializer extends StdSerializer<GameScore> {

    public GameScoreSerializer() {
        this(null);
    }

    public GameScoreSerializer(Class<GameScore> score) {
        super(score);
    }

    @Override
    public void serialize(GameScore score, JsonGenerator jgen, SerializerProvider provider) throws IOException {

        jgen.writeStartObject();

        for (var entry : score.result.entrySet()) {
            jgen.writeStringField(entry.getKey(), Integer.toString(entry.getValue()));
        }

        jgen.writeEndObject();
    }
}
