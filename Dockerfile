# Etapa 1: Construcción del UI (Next.js)
FROM node:18 AS builder-ui
WORKDIR /ui
COPY ui/ ./
RUN npm install && npm run build

# Etapa 2: Construcción del backend (Go)
FROM golang:1.24 AS builder-go
WORKDIR /app
COPY app/ ./app/
WORKDIR /app/app
RUN go mod tidy
RUN go build -o /app/server ./cmd/api

# Etapa final: Unificación (usar Node.js para servir UI y correr Go backend)
FROM node:18-slim

# Instalar solo dependencias mínimas del sistema
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Copiar backend compilado
COPY --from=builder-go /app/server /app/server
COPY app/db/procedures.sql /app/db/procedures.sql

# Copiar UI compilado
COPY --from=builder-ui /ui/public /ui/public
COPY --from=builder-ui /ui/.next /ui/.next
COPY --from=builder-ui /ui/package.json /ui/package.json

# Instalar dependencias de producción del UI
WORKDIR /ui
RUN npm install --omit=dev

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000 4001

CMD ["/entrypoint.sh"]
