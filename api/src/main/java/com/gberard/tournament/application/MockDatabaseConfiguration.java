package com.gberard.tournament.application;

import org.springframework.boot.flyway.autoconfigure.FlywayMigrationStrategy;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

@Configuration(proxyBeanMethods = false)
@Profile("mock")
public class MockDatabaseConfiguration {

    @Bean
    FlywayMigrationStrategy cleanAndMigrate() {
        return flyway -> {
            flyway.clean();
            flyway.migrate();
        };
    }
}
