package com.gberard.tournament.data.game.score;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;

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
