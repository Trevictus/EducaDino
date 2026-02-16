# ╔═══════════════════════════════════════════════════════════════╗
# ║           EDUCADINO - Dockerfile Backend                      ║
# ╚═══════════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════════
# ETAPA 1: Build con Maven
# ═══════════════════════════════════════════════════════════════
FROM maven:3.9-eclipse-temurin-21-alpine AS builder

WORKDIR /app

# Copiar pom.xml primero (capa cacheada para dependencias)
COPY pom.xml .

# Descargar dependencias (capa cacheada)
RUN mvn dependency:go-offline -B

# Copiar código fuente
COPY src ./src

# Compilar la aplicación
RUN mvn clean package -DskipTests -B

# ═══════════════════════════════════════════════════════════════
# ETAPA 2: Imagen de producción
# ═══════════════════════════════════════════════════════════════
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S educadino && \
    adduser -u 1001 -S educadino -G educadino

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Copiar JAR desde la etapa de build
COPY --from=builder /app/target/*.jar app.jar

# Cambiar propietario
RUN chown educadino:educadino app.jar

# Usar usuario no-root
USER educadino

# Exponer puerto
EXPOSE 8080

# Variables de entorno por defecto
ENV JAVA_OPTS="-Xms256m -Xmx512m"

# Comando de inicio
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]


