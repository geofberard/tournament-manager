package com.gberard.tournament.application.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class GamesApiIntegrationTest {

    @LocalServerPort
    private int port;

    private final ObjectMapper objectMapper = new ObjectMapper();

    private HttpClient httpClient;

    @BeforeEach
    void setUp() throws Exception {
        httpClient = HttpClient.newBuilder()
                .cookieHandler(new CookieManager(null, CookiePolicy.ACCEPT_ALL))
                .build();

        HttpResponse<String> loginResponse = send(
                "/api/admin/auth/login",
                "POST",
                """
                {
                  "username": "admin",
                  "password": "admin123"
                }
                """
        );

        assertEquals(200, loginResponse.statusCode());
    }

    @Test
    void shouldCreateACompletePoolScheduleAndRejectDuplicateCreation() throws Exception {
        // GIVEN
        String requestBody = """
                {
                  "phaseId": "phase_1",
                  "group": "Poule integration bulk",
                  "startTime": "2026-06-20T09:00:00Z",
                  "gameDurationMinutes": 12,
                  "breakDurationMinutes": 3,
                  "court": "Terrain integration",
                  "teamIds": ["team_1", "team_2", "team_3"],
                  "assignReferees": true
                }
                """;

        // WHEN
        HttpResponse<String> response = send("/api/games/bulk-create", "POST", requestBody);

        // THEN
        assertEquals(201, response.statusCode());
        JsonNode games = objectMapper.readTree(response.body());
        assertEquals(3, games.size());
        assertEquals(
                Set.of(
                        "2026-06-20T09:00:00Z",
                        "2026-06-20T09:15:00Z",
                        "2026-06-20T09:30:00Z"
                ),
                gameTimes(games)
        );
        games.forEach(game -> {
            assertEquals("phase_1", game.path("phase").path("id").asText());
            assertEquals("Poule integration bulk", game.path("group").asText());
            assertTrue(game.path("subgroup").isNull());
            assertEquals("Terrain integration", game.path("court").asText());
            assertFalse(game.path("referee").isNull());
            assertFalse(contestantIds(game).contains(game.path("referee").path("id").asText()));
        });

        HttpResponse<String> duplicateResponse = send("/api/games/bulk-create", "POST", requestBody);
        assertEquals(400, duplicateResponse.statusCode());
    }

    private Set<String> gameTimes(JsonNode games) {
        Set<String> times = new HashSet<>();
        games.forEach(game -> times.add(game.path("time").asText()));
        return times;
    }

    private Set<String> contestantIds(JsonNode game) {
        Set<String> ids = new HashSet<>();
        game.path("contestants").forEach(contestant -> ids.add(contestant.path("id").asText()));
        return ids;
    }

    private HttpResponse<String> send(String path, String method, String body) throws Exception {
        HttpRequest.Builder requestBuilder = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:" + port + path))
                .header(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE);

        if (body == null) {
            requestBuilder.method(method, HttpRequest.BodyPublishers.noBody());
        } else {
            requestBuilder
                    .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                    .method(method, HttpRequest.BodyPublishers.ofString(body));
        }

        return httpClient.send(requestBuilder.build(), HttpResponse.BodyHandlers.ofString());
    }
}
