package com.gberard.tournament.data.game.score;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class SetScoreSerializer extends StdSerializer<SetScore> {

    public SetScoreSerializer() {
        this(null);
    }

    public SetScoreSerializer(Class<SetScore> score) {
        super(score);
    }

    @Override
    public void serialize(SetScore score, JsonGenerator jgen, SerializerProvider provider) throws IOException {

        jgen.writeStartArray();

        for (GameScore gameScore : score.getResult()) {
            jgen.writeObject(gameScore);
        }

        jgen.writeEndArray();
    }
}
