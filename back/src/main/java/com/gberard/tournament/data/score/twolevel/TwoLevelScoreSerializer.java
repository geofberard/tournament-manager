package com.gberard.tournament.data.score.twolevel;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.gberard.tournament.data.score.onelevel.OneLevelScore;

import java.io.IOException;

public class TwoLevelScoreSerializer extends StdSerializer<TwoLevelScore> {

    public TwoLevelScoreSerializer() {
        this(null);
    }

    public TwoLevelScoreSerializer(Class<TwoLevelScore> score) {
        super(score);
    }

    @Override
    public void serialize(TwoLevelScore score, JsonGenerator jgen, SerializerProvider provider) throws IOException {

        jgen.writeStartArray();

        for (OneLevelScore gameScore : score.getResult()) {
            jgen.writeObject(gameScore);
        }

        jgen.writeEndArray();
    }
}
