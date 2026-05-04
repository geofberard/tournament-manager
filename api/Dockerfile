FROM maven:3.9.11-eclipse-temurin-25 AS build

WORKDIR /workspace

COPY api/pom.xml api/pom.xml
COPY api/src api/src
COPY contract/openapi.yaml contract/openapi.yaml

RUN mvn -f api/pom.xml -DskipTests package
RUN cp "$(find /workspace/api/target -maxdepth 1 -name '*.jar' ! -name '*.jar.original' | head -n 1)" /workspace/app.jar

FROM eclipse-temurin:25-jre

WORKDIR /app

COPY --from=build /workspace/app.jar /app/app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
