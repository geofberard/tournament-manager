package com.gberard.tournament.data.game;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.gberard.tournament.data.contestant.Team;
import com.gberard.tournament.data.score.*;
import com.gberard.tournament.data.score.game.GameScore;
import com.gberard.tournament.data.score.set.SetScore;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.*;

import static com.gberard.tournament.data.score.ScoreUtils.scoreFromJson;
import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;

@Slf4j
public class GameDeserializer extends StdDeserializer<Game> {

    private static Set<Class<? extends Score>> supportedScore = Set.of(GameScore.class, SetScore.class);

    public GameDeserializer() {
        this(null);
    }

    public GameDeserializer(Class<?> vc) {
        super(vc);
    }

    @Override
    public Game deserialize(JsonParser jp, DeserializationContext ctxt) throws IOException {
        JsonNode node = jp.getCodec().readTree(jp);

        ObjectMapper mapper = new ObjectMapper();

        Game.GameBuilder builder = Game.builder()
                .id(node.get("id").asText())
                .time(LocalDateTime.parse(node.get("time").asText(), ISO_LOCAL_DATE_TIME))
                .court(node.get("court").asText())
                .contestants(mapper
                        .readValue(
                                node.get("contestants").toString(),
                                mapper.getTypeFactory().constructCollectionType(List.class, Team.class)
                        ));

        if (node.has("referee")) {
            builder.referee(mapper.readValue(node.get("referee").toString(), Team.class));
        }

        if (node.has("scoreType") && node.has("score")) {
            scoreFromJson(node.get("score").toString(), node.get("scoreType").asText())
                    .ifPresent(score -> builder.score(score));
        }

        return builder.build();
    }

}
