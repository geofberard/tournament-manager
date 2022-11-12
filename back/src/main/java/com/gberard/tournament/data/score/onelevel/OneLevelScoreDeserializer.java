package com.gberard.tournament.data.score.onelevel;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.HashMap;

public class OneLevelScoreDeserializer extends StdDeserializer<OneLevelScore> {

    public OneLevelScoreDeserializer() {
        this(null);
    }

    public OneLevelScoreDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public OneLevelScore deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        JsonNode node = jp.getCodec().readTree(jp);

        HashMap<String, Integer> score = new HashMap<>();
        node.fields().forEachRemaining(entry -> score.put(entry.getKey(), entry.getValue().intValue()));

        return new OneLevelScore(score);
    }
}
