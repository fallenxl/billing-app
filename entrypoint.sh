#!/bin/bash

# Ejecutar backend (Go)
./app/server &

# Ejecutar frontend (Next.js en modo producción)
cd /ui
npm run start
