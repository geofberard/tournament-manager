package com.gberard.tournament.application.api;

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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class PhasesApiIntegrationTest {

    @LocalServerPort
    private int port;

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
    void shouldRejectDeletionWhenPhaseIsUsedByAGame() throws Exception {
        // WHEN
        HttpResponse<String> response = send("/api/phases/phase_1", "DELETE", null);

        // THEN
        assertEquals(409, response.statusCode());
        assertTrue(response.body().contains("\"code\":\"PHASE_IN_USE\""));
        assertTrue(response.body().contains("Phase phase_1 is still referenced by existing games"));
    }

    @Test
    void shouldRejectDeletionWhenPhaseHasChildren() throws Exception {
        HttpResponse<String> response = send("/api/phases/phase_poules", "DELETE", null);

        assertEquals(409, response.statusCode());
        assertTrue(response.body().contains("\"code\":\"PHASE_HAS_CHILDREN\""));
        assertTrue(response.body().contains("Phase phase_poules still contains child phases"));
    }

    @Test
    void shouldRejectMovingAPhaseUnderOneOfItsDescendants() throws Exception {
        HttpResponse<String> response = send(
                "/api/phases/phase_poules",
                "PUT",
                """
                {
                  "parentId": "phase_1",
                  "name": "Phase de poules",
                  "order": 1
                }
                """
        );

        assertEquals(409, response.statusCode());
        assertTrue(response.body().contains("\"code\":\"PHASE_HIERARCHY_CYCLE\""));
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
