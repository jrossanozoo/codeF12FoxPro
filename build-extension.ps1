# Script para generar el paquete VSIX de la extensión FoxPro Go to Definition
# Autor: Generado automáticamente
# Fecha: $(Get-Date -Format "yyyy-MM-dd")

Write-Host "🚀 Iniciando proceso de construcción de la extensión FoxPro..." -ForegroundColor Green

# Verificar si Node.js está instalado
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: Node.js no está instalado o no está en el PATH" -ForegroundColor Red
    Write-Host "Por favor, instala Node.js desde https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Verificar si npm está disponible
try {
    $npmVersion = npm --version
    Write-Host "✅ npm detectado: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: npm no está disponible" -ForegroundColor Red
    exit 1
}

# Verificar si vsce está instalado globalmente
try {
    $vsceVersion = vsce --version
    Write-Host "✅ vsce detectado: $vsceVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  vsce no está instalado globalmente. Instalando..." -ForegroundColor Yellow
    npm install -g vsce
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error al instalar vsce" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ vsce instalado correctamente" -ForegroundColor Green
}

# Limpiar compilaciones anteriores
Write-Host "🧹 Limpiando archivos de compilación anteriores..." -ForegroundColor Cyan
if (Test-Path "out") {
    Remove-Item -Recurse -Force "out"
    Write-Host "✅ Directorio 'out' limpiado" -ForegroundColor Green
}

# Instalar dependencias
Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al instalar dependencias" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencias instaladas correctamente" -ForegroundColor Green

# Compilar el proyecto
Write-Host "🔨 Compilando el proyecto TypeScript..." -ForegroundColor Cyan
npm run compile
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error en la compilación" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Compilación completada" -ForegroundColor Green

# Ejecutar linter (opcional, pero recomendado)
Write-Host "🔍 Ejecutando linter..." -ForegroundColor Cyan
npm run lint
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Advertencias del linter detectadas, pero continuando..." -ForegroundColor Yellow
}

# Generar el paquete VSIX
Write-Host "📦 Generando paquete VSIX..." -ForegroundColor Cyan
vsce package
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error al generar el paquete VSIX" -ForegroundColor Red
    exit 1
}

# Buscar el archivo VSIX generado
$vsixFile = Get-ChildItem -Name "*.vsix" | Select-Object -First 1
if ($vsixFile) {
    Write-Host "🎉 ¡Paquete VSIX generado exitosamente!" -ForegroundColor Green
    Write-Host "📄 Archivo: $vsixFile" -ForegroundColor White
    Write-Host "📁 Ubicación: $(Get-Location)\$vsixFile" -ForegroundColor White
    
    # Mostrar información del archivo
    $fileInfo = Get-Item $vsixFile
    Write-Host "📏 Tamaño: $([math]::Round($fileInfo.Length / 1MB, 2)) MB" -ForegroundColor White
    Write-Host "📅 Creado: $($fileInfo.CreationTime)" -ForegroundColor White
} else {
    Write-Host "❌ No se encontró el archivo VSIX generado" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✨ Proceso completado exitosamente ✨" -ForegroundColor Green
Write-Host "Para instalar la extensión, consulta el archivo INSTALL.md" -ForegroundColor Cyan