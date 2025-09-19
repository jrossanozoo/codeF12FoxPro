#!/bin/bash

echo "==================================="
echo "FoxPro Go to Definition Extension"
echo "Instalador rápido"
echo "==================================="

# Verificar que estamos en el directorio correcto
if [ ! -f "package.json" ]; then
    echo "? Error: Ejecutar desde el directorio extensionF12foxpro"
    exit 1
fi
echo "?? Instalando dependencias..."
npm install

echo "?? Compilando TypeScript..."
npm run compile

if [ $? -eq 0 ]; then
    echo "? Compilación exitosa!"
    echo ""
    echo "?? Para probar la extensión:"
    echo "1. Abrir VS Code en este directorio"
    echo "2. Presionar F5 para ejecutar en modo desarrollo"
    echo "3. En la nueva ventana, abrir ejemplos/ejemplo_test.prg"
    echo "4. Posicionar cursor sobre un nombre de clase y presionar F12"
    echo ""
    echo "?? Ver README.md para documentación completa"
    echo "?? Ver TESTING.md para instrucciones de prueba"
else
    echo "? Error en la compilación"
    exit 1
fi