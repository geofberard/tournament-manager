package com.gberard.tournament.data.score.game;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;

import java.io.IOException;
import java.util.HashMap;

public class GameScoreDeserializer extends StdDeserializer<GameScore> {

    public GameScoreDeserializer() {
        this(null);
    }

    public GameScoreDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public GameScore deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        JsonNode node = jp.getCodec().readTree(jp);

        HashMap<String, Integer> score = new HashMap<>();
        node.fields().forEachRemaining(entry -> score.put(entry.getKey(), entry.getValue().intValue()));

        return new GameScore(score);
    }
}
