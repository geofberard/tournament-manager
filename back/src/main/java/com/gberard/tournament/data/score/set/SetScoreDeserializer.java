package com.gberard.tournament.data.score.set;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.gberard.tournament.data.score.game.GameScore;

import java.io.IOException;
import java.util.Arrays;

public class SetScoreDeserializer extends StdDeserializer<SetScore> {

    public SetScoreDeserializer() {
        this(null);
    }

    public SetScoreDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public SetScore deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        GameScore[] x = jp.getCodec().readValue(jp, GameScore[].class);
;
        return new SetScore(Arrays.asList(x));
    }
}
