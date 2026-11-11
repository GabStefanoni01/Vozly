# Build context: repository root
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /workspace

COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

RUN mvn --batch-mode --no-transfer-progress -f backend/pom.xml -DskipTests package

FROM eclipse-temurin:21-jre-jammy AS runtime
WORKDIR /app

RUN groupadd --system spring     && useradd --system --gid spring --home-dir /app spring

COPY --from=build --chown=spring:spring \
    /workspace/backend/target/vozly-backend-0.1.0-SNAPSHOT.jar \
    /app/app.jar

USER spring:spring

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "exec java ${JAVA_OPTS:-} -jar /app/app.jar"]
