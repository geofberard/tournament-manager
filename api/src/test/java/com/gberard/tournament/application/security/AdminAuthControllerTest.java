package com.gberard.tournament.application.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.io.IOException;
import java.net.CookieManager;
import java.net.CookiePolicy;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class AdminAuthControllerTest {

    @LocalServerPort
    private int port;

    private HttpClient httpClient;

    @BeforeEach
    void setUp() {
        this.httpClient = HttpClient.newBuilder()
                .cookieHandler(new CookieManager(null, CookiePolicy.ACCEPT_ALL))
                .build();
    }

    @Test
    void shouldReturnAnonymousSessionWhenNotAuthenticated() throws Exception {
        HttpResponse<String> response = send(
                "/api/admin/auth/session",
                "GET",
                null
        );

        assertEquals(200, response.statusCode());
        assertTrue(response.body().contains("\"authenticated\":false"));
        assertTrue(response.body().contains("\"username\":null"));
    }

    @Test
    void shouldAuthenticateAdminAndReuseSession() throws Exception {
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
        assertTrue(loginResponse.body().contains("\"authenticated\":true"));
        assertTrue(loginResponse.body().contains("\"username\":\"admin\""));

        HttpResponse<String> sessionResponse = send(
                "/api/admin/auth/session",
                "GET",
                null
        );

        assertEquals(200, sessionResponse.statusCode());
        assertTrue(sessionResponse.body().contains("\"authenticated\":true"));
        assertTrue(sessionResponse.body().contains("\"username\":\"admin\""));
    }

    @Test
    void shouldRejectInvalidCredentials() throws Exception {
        HttpResponse<String> response = send(
                "/api/admin/auth/login",
                "POST",
                """
                {
                  "username": "admin",
                  "password": "bad-password"
                }
                """
        );

        assertEquals(401, response.statusCode());
    }

    @Test
    void shouldAllowWriteApiWhenNotAuthenticated() throws Exception {
        HttpResponse<String> response = send(
                "/api/teams",
                "POST",
                """
                {
                  "name": "Equipe securisee"
                }
                """
        );

        assertEquals(201, response.statusCode());
        assertTrue(response.body().contains("\"name\":\"Equipe securisee\""));
    }

    private HttpResponse<String> send(String path, String method, String body) throws IOException, InterruptedException {
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
