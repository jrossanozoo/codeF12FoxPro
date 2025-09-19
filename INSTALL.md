# Instalación de la Extensión FoxPro Go to Definition

Esta guía te ayudará a generar e instalar la extensión FoxPro Go to Definition para Visual Studio Code.

## 📋 Prerrequisitos

Antes de generar e instalar la extensión, asegúrate de tener instalado:

### 1. Node.js (versión 16 o superior)
- **Descargar desde:** https://nodejs.org/
- **Verificar instalación:**
  ```powershell
  node --version
  npm --version
  ```

### 2. Visual Studio Code Extension Manager (vsce)
- **Instalar globalmente:**
  ```powershell
  npm install -g @vscode/vsce
  ```
- **Verificar instalación:**
  ```powershell
  vsce --version
  npx @vscode/vsce --version
  ```

## 🔨 Generación del paquete VSIX

### Opción 1: Usar el script automatizado (Recomendado)

1. **Abrir PowerShell como administrador** en el directorio del proyecto
2. **Ejecutar el script:**
   ```powershell
   .\build-extension.ps1
   ```

El script realizará automáticamente:
- ✅ Verificación de prerrequisitos
- ✅ Instalación de dependencias
- ✅ Compilación del código TypeScript
- ✅ Ejecución del linter
- ✅ Generación del paquete VSIX

### Opción 2: Proceso manual

Si prefieres ejecutar los comandos manualmente:

```powershell
# 1. Instalar dependencias
npm install

# 2. Compilar el proyecto
npm run compile

# 3. Ejecutar linter (opcional)
npm run lint

# 4. Generar el paquete VSIX
vsce package
npx @vscode/vsce package
```

## 📦 Instalación de la extensión

Una vez generado el archivo `.vsix`, puedes instalarlo de las siguientes maneras:

### Opción 1: Desde Visual Studio Code (GUI)

1. **Abrir Visual Studio Code**
2. **Ir a Extensiones** (`Ctrl+Shift+X`)
3. **Hacer clic en el menú "..."** (tres puntos) en la parte superior del panel de extensiones
4. **Seleccionar "Install from VSIX..."**
5. **Navegar y seleccionar** el archivo `.vsix` generado
6. **Reiniciar VS Code** cuando se solicite

### Opción 2: Desde la línea de comandos

```powershell
# Instalar usando el CLI de VS Code
code --install-extension foxpro-go-to-definition-1.0.0.vsix
```

### Opción 3: Usando vsce

```powershell
# Instalar directamente con vsce
vsce install foxpro-go-to-definition-1.0.0.vsix
```

## 🔧 Verificación de la instalación

Para verificar que la extensión se instaló correctamente:

1. **Abrir un archivo `.prg`** en VS Code
2. **Verificar que el lenguaje** se detecte como "FoxPro"
3. **Probar la funcionalidad F12** en una función o clase

## 🚀 Uso de la extensión

### Características principales:

- **Go to Definition (F12):** Navega a la definición de funciones, procedimientos y clases
- **Soporte para framework Organic:** Reconoce patrones específicos del framework
- **Archivos soportados:** `.prg` y `.PRG`

### Comandos disponibles:

- `F12` o `Ctrl+Click`: Ir a definición
- `Ctrl+Shift+P` → "FoxPro: Go to Definition": Comando manual

## 🐛 Solución de problemas

### Error: "vsce no se reconoce como comando"
```powershell
# Reinstalar vsce globalmente
npm install -g vsce
```

### Error: "Node.js no encontrado"
- Asegúrate de que Node.js esté instalado y en el PATH del sistema
- Reinicia PowerShell después de instalar Node.js

### Error de permisos en PowerShell
```powershell
# Cambiar política de ejecución temporalmente
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### La extensión no se activa
1. Verificar que el archivo tenga extensión `.prg`
2. Reiniciar VS Code completamente
3. Verificar en `Ctrl+Shift+P` → "Developer: Reload Window"

## 📁 Estructura del proyecto

```
foxpro-extension/
├── build-extension.ps1    # Script de construcción
├── package.json          # Configuración del paquete
├── src/                  # Código fuente TypeScript
├── out/                  # Código compilado (generado)
└── *.vsix               # Paquete de extensión (generado)
```

## 📝 Notas adicionales

- **Versión actual:** 1.0.0
- **Compatibilidad:** VS Code 1.74.0 o superior
- **Lenguajes soportados:** FoxPro (.prg)
- **Framework:** Soporte especial para Organic Framework

## 🤝 Contribuciones

Para contribuir al desarrollo de esta extensión:

1. Fork del repositorio
2. Crear una rama para tu feature
3. Realizar cambios y tests
4. Generar el VSIX para pruebas
5. Crear un Pull Request

---

*Para más información, consulta el archivo README.md del proyecto.*