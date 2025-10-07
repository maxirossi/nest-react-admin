#!/bin/bash

# Script para producción
echo "🚀 Iniciando entorno de producción..."

# Parar contenedores existentes
echo "🛑 Parando contenedores existentes..."
docker compose down

# Iniciar con configuración de producción
echo "📦 Iniciando con configuración de producción..."
docker compose up --build -d

echo "✅ Entorno de producción iniciado!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
