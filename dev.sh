#!/bin/bash

# Script para desarrollo con volúmenes
echo "🚀 Iniciando entorno de desarrollo..."

# Parar contenedores existentes
echo "🛑 Parando contenedores existentes..."
docker compose down

# Iniciar con volúmenes de desarrollo
echo "📦 Iniciando con volúmenes de desarrollo..."
docker compose -f docker-compose.dev.yml up --build -d

echo "✅ Entorno de desarrollo iniciado!"
echo "📝 Los cambios en el código se reflejarán automáticamente"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:5000"
