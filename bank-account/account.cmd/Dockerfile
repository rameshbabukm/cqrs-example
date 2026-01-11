FROM eclipse-temurin:17-jdk

ARG JAR_FILE=target/*.jar

COPY ${JAR_FILE} account.cmd.jar

ENTRYPOINT ["java", "-jar", "/account.cmd.jar"]

EXPOSE 5000