@echo off
echo ========================================
echo   Los de Siempre Sneakers CRM
echo ========================================
echo.
echo Iniciando el CRM de zapatillas...
echo.

REM Verificar si Node.js está instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado
    echo Por favor, instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

REM Verificar si las dependencias están instaladas
if not exist "node_modules" (
    echo Instalando dependencias...
    npm install
    if %errorlevel% neq 0 (
        echo ERROR: No se pudieron instalar las dependencias
        pause
        exit /b 1
    )
)

echo.
echo Iniciando el servidor de desarrollo...
echo El CRM estará disponible en: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener el servidor
echo.

npm run dev

pause
