FROM openjdk:14-alpine
COPY build/libs/POIManager-*-all.jar POIManager.jar
EXPOSE 8080
CMD ["java", "-Dcom.sun.management.jmxremote", "-Xmx128m", "-jar", "POIManager.jar"]