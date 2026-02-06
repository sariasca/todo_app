# Imagen base con Java 25
FROM eclipse-temurin:25-jdk-jammy

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo mvnw y pom.xml primero para cachear dependencias
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Cache de dependencias
RUN ./mvnw dependency:go-offline

# Copiamos todo el código fuente
COPY src ./src

# Build del proyecto, saltando tests
RUN ./mvnw clean package -DskipTests

# Puerto que usará Render
ENV PORT=8080
EXPOSE 8080

# Start command
CMD ["java", "-jar", "target/*.jar"]
