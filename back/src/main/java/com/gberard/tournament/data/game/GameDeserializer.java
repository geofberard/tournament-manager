package com.gberard.tournament.data.game;

import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.deser.std.StdDeserializer;
import com.fasterxml.jackson.databind.ser.std.StdSerializer;
import com.gberard.tournament.data.contestant.Contestant;
import com.gberard.tournament.data.contestant.Team;
import com.gberard.tournament.data.game.score.GameScore;
import com.gberard.tournament.data.game.score.Score;
import com.gberard.tournament.data.game.score.ScoreType;
import com.gberard.tournament.data.game.score.SetScore;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;

import static com.gberard.tournament.data.DataUtils.getValue;
import static com.gberard.tournament.data.DataUtils.parseDateTime;
import static java.time.format.DateTimeFormatter.ISO_LOCAL_DATE_TIME;

public class GameDeserializer extends StdDeserializer<Game> {

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

        if(node.has("referee")) {
            builder.referee(mapper.readValue(node.get("referee").toString(), Team.class));
        }

        if(node.has("scoreType")) {
            ScoreType scoreType = mapper.readValue(node.get("scoreType").toString(), ScoreType.class);
            switch (scoreType) {
                case GameScore -> builder.score(mapper.readValue(node.get("score").toString(), GameScore.class));
                case SetScore -> builder.score(mapper.readValue(node.get("score").toString(), SetScore.class));
            }
        }

        return builder.build();
    }
}
