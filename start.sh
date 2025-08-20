#!/bin/bash

echo "========================================"
echo "  Los de Siempre Sneakers CRM"
echo "========================================"
echo ""
echo "Iniciando el CRM de zapatillas..."
echo ""

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado"
    echo "Por favor, instala Node.js desde: https://nodejs.org/"
    exit 1
fi

# Verificar si las dependencias están instaladas
if [ ! -d "node_modules" ]; then
    echo "Instalando dependencias..."
    npm install
    if [ $? -ne 0 ]; then
        echo "ERROR: No se pudieron instalar las dependencias"
        exit 1
    fi
fi

echo ""
echo "Iniciando el servidor de desarrollo..."
echo "El CRM estará disponible en: http://localhost:3000"
echo ""
echo "Presiona Ctrl+C para detener el servidor"
echo ""

npm run dev
