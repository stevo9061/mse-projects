# use official AmazonCorretto-Image to build the application
FROM maven:3.9.9-amazoncorretto-21 AS build

# set the working directory in container
WORKDIR /app

# copy the built jar file into the working directory of the container
COPY target/demo-0.0.1-SNAPSHOT.jar /app/demo-0.0.1-SNAPSHOT.jar

# expose the port on which the spring boot app is running
EXPOSE 8080

# run the application
ENTRYPOINT ["java", "-jar", "demo-0.0.1-SNAPSHOT.jar"]



