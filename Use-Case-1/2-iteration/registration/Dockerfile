# Stage 1. Build the JAR file
# Use official OpenJDK-Image to build the application
FROM maven:3.8.1-openjdk-17 AS build

# Set the working directory in container
WORKDIR /app

# Copy the Maven descriptor (pom.xml) separately to leverage Docker caching
COPY pom.xml .

# Download Maven dependencies (this step is cached if pom.xml does not change)
RUN mvn dependency:go-offline -B

# Copy the entire source code into the image
COPY src ./src

# Build the JAR-File
RUN mvn clean package -DskipTests

# Stage 2: Create the runtime image
# Use an official lightweight OpenJDK image for the runtime
FROM openjdk:17-jdk-slim

# Set the working directory in the runtime container
WORKDIR /app

# Copy the built JAR file from the build stage
COPY --from=build /app/target/registration-0.0.1-SNAPSHOT.jar /app/registration.jar

# Expose the port on which the spring boot app is running
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "/app/registration.jar"]



