
# Build stage
FROM eclipse-temurin:21-jdk AS build

WORKDIR /app

# Copy Maven Wrapper and project configuration first for better layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

RUN chmod +x mvnw

# Download dependencies before copying application source
RUN ./mvnw -B -DskipTests dependency:go-offline

COPY src/ src/

# Package the Spring Boot application
RUN ./mvnw -B -DskipTests package

# Runtime stage
FROM eclipse-temurin:21-jre

WORKDIR /app

RUN useradd --system --uid 10001 --create-home appuser

COPY --from=build /app/target/incident-backend-0.0.1-SNAPSHOT.jar app.jar

USER 10001

EXPOSE 8080

ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75.0", "-jar", "/app/app.jar"]
