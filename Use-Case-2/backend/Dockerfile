# --- Stage 1: Build ---
FROM maven:3.9.9-amazoncorretto-21 AS build
WORKDIR /app

# Copy only pom.xml, drag dependencies
COPY pom.xml .
RUN mvn dependency:go-offline

# Copy and compile source code
COPY src/ ./src/
RUN mvn package -DskipTests

# --- Stage 2: Run ---
FROM amazoncorretto:21
WORKDIR /app
COPY --from=build /app/target/demo-0.0.1-SNAPSHOT.jar /app/demo-0.0.1-SNAPSHOT.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","demo-0.0.1-SNAPSHOT.jar"]