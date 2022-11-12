package com.gberard.tournament.data.score.twolevel;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.gberard.tournament.data.score.onelevel.OneLevelScore;

import java.io.IOException;
import java.util.Arrays;

public class TwoLevelScoreDeserializer extends StdDeserializer<TwoLevelScore> {

    public TwoLevelScoreDeserializer() {
        this(null);
    }

    public TwoLevelScoreDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public TwoLevelScore deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        OneLevelScore[] x = jp.getCodec().readValue(jp, OneLevelScore[].class);
;
        return new TwoLevelScore(Arrays.asList(x));
    }
}
