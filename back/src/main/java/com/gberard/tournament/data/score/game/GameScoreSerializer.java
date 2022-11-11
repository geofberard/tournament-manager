package com.gberard.tournament.data.score.game;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

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
            jgen.writeNumberField(entry.getKey(), entry.getValue());
        }

        jgen.writeEndObject();
    }
}
