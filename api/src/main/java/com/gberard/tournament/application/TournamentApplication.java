package com.gberard.tournament.application;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.persistence.autoconfigure.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@OpenAPIDefinition(servers = {
        @Server(url = "/", description = "Serveur courant")
})
@SpringBootApplication(scanBasePackages={
        "com.gberard.tournament.generated.api" ,
        "org.openapitools.configuration",
        "com.gberard.tournament.application",
        "com.gberard.tournament.domain",
        "com.gberard.tournament.infrastructure"
})
@EnableJpaRepositories(basePackages = "com.gberard.tournament.infrastructure")
@EntityScan(basePackages = "com.gberard.tournament.infrastructure")
public class TournamentApplication {

    public static void main(String[] args) {
        SpringApplication.run(TournamentApplication.class, args);
    }

}
