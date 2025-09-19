#!/bin/bash
# Script simple para generar el paquete VSIX
# Para uso en sistemas Unix/Linux/MacOS

echo "🚀 Generando extensión FoxPro..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado"
    exit 1
fi

# Verificar/instalar vsce
if ! command -v vsce &> /dev/null; then
    echo "📦 Instalando vsce..."
    npm install -g vsce
fi

# Instalar dependencias y compilar
npm install && npm run compile && vsce package

echo "✅ ¡Extensión generada exitosamente!"