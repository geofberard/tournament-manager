package com.gberard.tournament.data.score.onelevel;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;

import java.io.IOException;

public class OneLevelScoreSerializer extends StdSerializer<OneLevelScore> {

    public OneLevelScoreSerializer() {
        this(null);
    }

    public OneLevelScoreSerializer(Class<OneLevelScore> score) {
        super(score);
    }

    @Override
    public void serialize(OneLevelScore score, JsonGenerator jgen, SerializerProvider provider) throws IOException {

        jgen.writeStartObject();

        for (var entry : score.result.entrySet()) {
            jgen.writeNumberField(entry.getKey(), entry.getValue());
        }

        jgen.writeEndObject();
    }
}
