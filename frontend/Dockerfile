# ╔═══════════════════════════════════════════════════════════════╗
# ║           EDUCADINO - Dockerfile Frontend                     ║
# ╚═══════════════════════════════════════════════════════════════╝

# ═══════════════════════════════════════════════════════════════
# ETAPA 1: Build con Node.js
# ═══════════════════════════════════════════════════════════════
FROM node:22-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Construir para producción
RUN npm run build -- --configuration=production

# ═══════════════════════════════════════════════════════════════
# ETAPA 2: Servidor Nginx
# ═══════════════════════════════════════════════════════════════
FROM nginx:alpine

# Copiar configuración de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar archivos compilados desde la etapa de build
COPY --from=builder /app/dist/educadino/browser /usr/share/nginx/html

# Crear usuario no-root
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Exponer puertos
EXPOSE 80 443

# Comando de inicio
CMD ["nginx", "-g", "daemon off;"]

