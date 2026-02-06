# Imagen base con Java 25
FROM eclipse-temurin:25-jdk AS builder

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo mvnw y pom.xml primero para cachear dependencias
COPY . .

# Cache de dependencias
RUN ./mvnw clean package -DskipTests

# Build del proyecto, saltando tests
FROM eclipse-temurin:25-jre

#Definir directorio de trabajo
WORKDIR /app

#Copiar fichero JAR del builder stage
COPY --from=builder /app/target/*.jar app.jar

# Puerto que usará
EXPOSE 8080

# Start command
ENTRYPOINT ["java", "-jar", "app.jar"]
