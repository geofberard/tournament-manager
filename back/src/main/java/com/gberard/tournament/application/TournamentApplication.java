package com.gberard.tournament.application;

import com.fasterxml.jackson.databind.MapperFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.json.JsonMapper;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import com.fasterxml.jackson.datatype.jsr310.ser.LocalDateTimeSerializer;
import com.gberard.tournament.application.response.Views;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@SpringBootApplication(scanBasePackages={
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

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins(
                                "http://localhost",
                                "https://geofberard.github.io/",
                                "https://static-scuf-tournois-prod.storage.googleapis.com/"
                        );
            }
        };
    }

    @Bean
    @Primary
    public ObjectMapper objectMapper() {
        JsonMapper jsonMapper = JsonMapper.builder()
                .enable(MapperFeature.DEFAULT_VIEW_INCLUSION)
                .build();

        jsonMapper.setConfig(jsonMapper.getSerializationConfig().withView(Views.TeamView.Basic.class));
        JavaTimeModule module = new JavaTimeModule();

        // Définir le format de sérialisation
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("YYYY-MM-dd HH:mm");
        module.addSerializer(LocalDateTime.class, new LocalDateTimeSerializer(formatter));

        // Définir le format de désérialisation
        module.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(formatter));

        jsonMapper.registerModule(module);

        jsonMapper.registerModule(new Jdk8Module());

        return jsonMapper;
    }

}
