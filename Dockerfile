# Etapa 1: Construcción del UI (Next.js)
FROM node:18 AS builder-ui
WORKDIR /ui
COPY ui/ ./
RUN npm install && npm run build

# Etapa 2: Construcción del backend (Go)
FROM golang:1.21 AS builder-go
WORKDIR /app
COPY app/ ./
RUN go mod tidy && go build -o server

# Etapa final: Unificación
FROM debian:bullseye-slim

# Instalar dependencias mínimas para Node.js y Go
RUN apt-get update && apt-get install -y ca-certificates nodejs npm && rm -rf /var/lib/apt/lists/*

# Copiar backend compilado
COPY --from=builder-go /app/server /app/server

# Copiar UI compilado
COPY --from=builder-ui /ui/public /ui/public
COPY --from=builder-ui /ui/.next /ui/.next
COPY --from=builder-ui /ui/package.json /ui/package.json

# Instalar solo dependencias necesarias para producción
WORKDIR /ui
RUN npm install --omit=dev

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000 8080

CMD ["/entrypoint.sh"]
