# use official OpenJDK-Image to build the application
FROM maven:3.8.1-openjdk-17 AS build

# set the working directory in container
WORKDIR /app

# copy the built jar file into the working directory of the container
COPY target/registration-0.0.1-SNAPSHOT.jar /app/registration-0.0.1-SNAPSHOT.jar

# expose the port on which the spring boot app is running
EXPOSE 8080

# run the application
ENTRYPOINT ["java", "-jar", "registration-0.0.1-SNAPSHOT.jar"]



