# FoxPro Go to Definition# FoxPro Go to Definition Extension



Una extensión de VS Code que proporciona funcionalidad "Go to Definition" (F12) **inteligente y eficiente** para archivos FoxPro (.prg).## Análisis del Caso



## 🎯 Características Principales### Problema Identificado

Visual Studio Code no tiene soporte nativo para la funcionalidad "Go to Definition" (F12) en archivos FoxPro (.prg). Esta funcionalidad es esencial para navegar eficientemente por el código, especialmente cuando se trabaja con proyectos complejos como el framework Organic que tiene múltiples formas de instanciar clases.

### ✅ Solo Funciona Cuando Debe Funcionar

Esta extensión ha sido diseñada para ser **inteligente y eficiente**. F12 **SOLO** funciona cuando detecta patrones de instanciación de clases, no para cualquier palabra en el código.### Requerimientos del Sistema



### 🚀 Soporte para Framework Organic#### 1. **Detección de Instanciación Estándar de FoxPro**

Soporte completo para los métodos del framework Organic con búsquedas optimizadas y orden de prioridad específico.```foxpro

* Casos estándar del lenguaje Visual FoxPro

### ⚡ Búsquedas OptimizadasloObjeto = createobject("nombre_de_clase")

- **Búsquedas dirigidas** basadas en el tipo de instanciaciónloObjeto = newobject("nombre_de_clase", "archivo.prg")

- **Límites de archivos** para evitar búsquedas lentas```

- **Orden de prioridad** para entidades del framework

#### 2. **Detección de Instanciación del Framework Organic**

## 📋 Casos Soportados

**Opción 1 - CrearObjeto**: Equivalente a newobject() con archivo opcional

### FoxPro Estándar```foxpro

```foxproloObjeto = _screen.Zoo.CrearObjeto("nombre_de_clase", "archivo.prg")

loObj = createobject("MiClase")        ' → busca MiClase.prg```

loCliente = newobject("Cliente")       ' → busca Cliente.prg

loCliente = newobject("Cliente", "entidades.prg")  ' → busca en entidades.prg**Opción 2 - CrearObjetoPorProducto**: Busca archivos con prefijo "ColorYTalle_"

``````foxpro

loObjeto = _screen.Zoo.CrearObjetoPorProducto("nombre_de_clase")

### Framework Organic* Busca: ColorYTalle_nombre_de_clase.prg

```

#### InstanciarEntidad

```foxpro**Opción 3 - InstanciarComponente**: Busca archivos con prefijo "componente"

loEntidad = _screen.Zoo.InstanciarEntidad("Factura")```foxpro

```loComponente = _screen.Zoo.InstanciarComponente("nombre_de_componente")

Busca en orden de prioridad:* Busca: componente + nombre_de_componente.prg

1. `entColorYTalle_Factura.prg````

2. `ent_Factura.prg`  

3. `din_EntidadFactura.prg`**Opción 4 - InstanciarEntidad**: Busca en orden de prioridad específico

```foxpro

#### InstanciarComponenteloEntidad = _screen.Zoo.InstanciarEntidad("nombre_de_entidad")

```foxpro* Busca en orden:

loComp = _screen.Zoo.InstanciarComponente("Validador")* 1) entColorYTalle_nombre_de_entidad.prg

```* 2) ent_nombre_de_entidad.prg  

Busca: `componenteValidador.prg`* 3) din_Entidadnombre_de_entidad.prg

```

#### CrearObjetoPorProducto

```foxpro#### 3. **Estrategia de Búsqueda Multi-nivel**

loProd = _screen.Zoo.CrearObjetoPorProducto("ReporteVentas")1. **Archivo actual**: Buscar `define class` en el mismo archivo

```2. **Archivo directo**: Buscar archivo `nombre_de_clase.prg`

Busca primero: `ColorYTalle_ReporteVentas.prg`3. **Patterns Organic**: Aplicar las reglas específicas del framework

Si no encuentra: `ReporteVentas.prg`4. **B�squeda general**: Buscar en todo el workspace como fallback



#### CrearObjeto---

```foxpro

loObj = _screen.Zoo.CrearObjeto("MiClase")## Implementación Técnica

loObj = _screen.Zoo.CrearObjeto("MiClase", "archivo.prg")

```### Arquitectura de la Extensión



### Definiciones de Clase```

```foxproextensionF12foxpro/

define class MiClase as Custom  ' → busca en archivo actual??? package.json                    # Configuración de la extensión

```??? language-configuration.json     # Configuración del lenguaje FoxPro

??? tsconfig.json                   # Configuración de TypeScript

## ❌ Casos NO Soportados??? .eslintrc.json                  # Configuración de linting

??? .vscode/                        # Configuración VS Code

F12 **NO** funciona para:?   ??? launch.json                 # Configuración de debugging

- Variables normales (`local lcTexto`)?   ??? tasks.json                  # Tasks de compilación

- Funciones que no son de instanciación (`upper()`, `len()`, etc.)??? src/

- Comentarios (`* MiClase`)?   ??? extension.ts                # Punto de entrada de la extensión

- Propiedades de objeto (`objeto.propiedad`)?   ??? definitionProvider.ts       # Lógica principal de búsqueda

- Palabras aleatorias en el código?   ??? test/                       # Tests unitarios

?       ??? runTest.ts             # Test runner

## 🛠️ Instalación?       ??? suite/

?           ??? index.ts           # Configuración de tests

1. Clonar o descargar esta extensión?           ??? extension.test.ts  # Tests de la extensión

2. Abrir en VS Code??? out/                           # Código JavaScript compilado

3. Presionar `F5` para ejecutar en modo desarrollo??? README.md                      # Esta documentación

4. En la nueva ventana, abrir archivos .prg```

5. Usar `F12` sobre nombres de clase en los patrones soportados

### Componentes Principales

## 🧪 Pruebas

#### 1. **FoxProDefinitionProvider**

El archivo `ejemplos/test_extension.prg` contiene casos de prueba para verificar el funcionamiento:Clase principal que implementa `vscode.DefinitionProvider`:

- Casos que deben funcionar ✅

- Casos que NO deben funcionar ❌- **`provideDefinition()`**: Punto de entrada cuando se presiona F12

- **`extractClassName()`**: Extrae el nombre de la clase usando regex patterns

## ⚡ Rendimiento- **`findClassDefinition()`**: Coordina la búsqueda usando múltiples estrategias

- **`findOrganicClassDefinitions()`**: Implementa las reglas específicas del framework Organic

- **Rápido**: Solo busca cuando debe buscar

- **Eficiente**: Búsquedas dirigidas con límites#### 2. **Patterns de Detección Inteligente**

- **Preciso**: Solo muestra resultados relevantes```typescript

const patterns = [

## 📝 Desarrollo    { regex: /createobject\s*\(\s*['"]*([a-zA-Z_][a-zA-Z0-9_]*)/i, type: 'standard' },

    { regex: /newobject\s*\(\s*['"]*([a-zA-Z_][a-zA-Z0-9_]*)/i, type: 'standard' },

```bash    { regex: /_screen\.zoo\.crearobjeto\s*\(\s*['"]*([a-zA-Z_][a-zA-Z0-9_]*)/i, type: 'organic' },

# Instalar dependencias    { regex: /_screen\.zoo\.crearobjetoporproducto\s*\(\s*['"]*([a-zA-Z_][a-zA-Z0-9_]*)/i, type: 'product' },

npm install    { regex: /_screen\.zoo\.instanciarcomponente\s*\(\s*['"]*([a-zA-Z_][a-zA-Z0-9_]*)/i, type: 'component' },

    { regex: /_screen\.zoo\.instanciarentidad\s*\(\s*['"]*([a-zA-Z_][a-zA-Z0-9_]*)/i, type: 'entity' },

# Compilar    { regex: /define\s+class\s+([a-zA-Z_][a-zA-Z0-9_]*)/i, type: 'definition' }

npx tsc -p ./];

```

# Ejecutar en modo desarrollo

F5 en VS Code#### 3. **L�gica de B�squeda Contextual**

```

```typescript

---// La extensión detecta automáticamente el tipo de instanciación 

// y aplica la estrategia de búsqueda correspondiente:

**Nota**: Esta extensión está optimizada para trabajar con el framework Organic y patrones estándar de FoxPro. Solo funciona cuando detecta instanciaciones legítimas de clases.
switch (patternType) {
    case 'entity':
        // Para InstanciarEntidad - buscar en orden de prioridad
        organicPatterns = [
            `entColorYTalle_${className}.prg`,
            `ent_${className}.prg`,
            `din_Entidad${className}.prg`
        ];
        break;
        
    case 'component':
        // Para InstanciarComponente
        organicPatterns = [
            `componente${className}.prg`,
            `Componente${className}.prg`
        ];
        break;
        
    case 'product':
        // Para CrearObjetoPorProducto
        organicPatterns = [
            `ColorYTalle_${className}.prg`
        ];
        break;
}
```

### Características Técnicas Destacadas

#### ? **Funcionalidades Implementadas**
- **Detección inteligente del contexto**: Reconoce el tipo de instanciación automáticamente
- **Soporte completo para el framework Organic**: Todas las 4 opciones implementadas
- **Búsqueda multi-estrategia con priorización**: Optimiza el orden de búsqueda
- **Manejo de archivos con y sin language ID**: Funciona con cualquier archivo .prg
- **Soporte para variaciones de nomenclatura**: Mayúsculas, minúsculas, mixto
- **Búsqueda optimizada**: Evita directorios innecesarios (`node_modules`, etc.)

#### ?? **Optimizaciones de Performance**
- **Límites de búsqueda**: Máximo 10 archivos por patrón, 100 en búsqueda general
- **Exclusión automática**: Excluye directorios innecesarios
- **Búsqueda asíncrona**: No bloquea la interfaz de usuario
- **Cache implícito**: VS Code cachea los resultados automáticamente
- **Búsqueda inteligente**: Prioriza resultados más específicos

#### ??? **Manejo Robusto de Errores**
- **Validación de workspace**: Verifica workspace válido antes de buscar
- **Manejo de archivos**: Gestiona archivos no existentes o sin permisos
- **Logging detallado**: Información de debug para desarrollo
- **Fallbacks múltiples**: Si una estrategia falla, intenta otras

---

## Instalación y Configuración

### Pre-requisitos
- Visual Studio Code 1.74.0 o superior
- Node.js 16.x o superior
- TypeScript 4.9.0 o superior

### 1. **Instalación para Desarrollo**

```bash
# Clonar o crear el directorio de la extensión
git clone <repositorio> ~/extensionF12foxpro
# O crear manualmente:
mkdir ~/extensionF12foxpro
cd ~/extensionF12foxpro

# Instalar dependencias
npm install

# Compilar TypeScript
npm run compile

# Ejecutar tests (opcional)
npm test
```

### 2. **Activación en VS Code**

#### **Método 1: Modo Desarrollo (Recomendado para pruebas)**
1. Abrir VS Code
2. Abrir la carpeta `~/extensionF12foxpro`
3. Presionar `F5` o ir a `Run > Start Debugging`
4. Seleccionar "Run Extension"
5. Se abrirá una nueva ventana de VS Code con la extensión cargada

#### **Método 2: Empaquetado e Instalaci�n**
```bash
# Instalar vsce (VS Code Extension Manager) si no lo tienes
npm install -g vsce

# Empaquetar la extensión
npm run package
# O manualmente: vsce package

# Instalar el .vsix generado
code --install-extension foxpro-go-to-definition-1.0.0.vsix
```

### 3. **Configuración del Lenguaje**

#### **Asociar Archivos .prg con FoxPro**
Agregar a `settings.json` de VS Code:
```json
{
    "files.associations": {
        "*.prg": "foxpro",
        "*.PRG": "foxpro"
    }
}
```

#### **Configuración Opcional Avanzada**
```json
{
    "foxpro.search.maxResults": 10,
    "foxpro.search.includeCurrentFile": true,
    "foxpro.debug.enabled": false,
    "foxpro.organic.enableFrameworkSupport": true
}
```

---

## Guía de Uso

### 1. **Operación Básica**
1. **Abrir** un archivo `.prg` en VS Code
2. **Posicionar** el cursor sobre el nombre de una clase en:
   - Declaración: `define class MiClase`
   - Instanciación: `createobject("MiClase")`
   - Framework Organic: `_screen.Zoo.CrearObjeto("MiClase")`
3. **Presionar** `F12` o hacer clic derecho ? "Go to Definition"

### 2. **Casos de Uso Soportados**

#### **A. Instanciación Estándar de FoxPro**
```foxpro
* Ir a definición desde cualquiera de estas líneas:
loObjeto = createobject("MiClase")          && ? F12 aquí
loObjeto = newobject("MiClase", "archivo.prg")  && ? F12 aquí
```

#### **B. Framework Organic - Entidades**
```foxpro
* Busca en orden: entColorYTalle_Cliente.prg ? ent_Cliente.prg ? din_EntidadCliente.prg
loCliente = _screen.Zoo.InstanciarEntidad("Cliente")  && ? F12 aquí
```

#### **C. Framework Organic - Componentes**
```foxpro
* Busca: componenteValidador.prg
loValidador = _screen.Zoo.InstanciarComponente("Validador")  && ? F12 aquí
```

#### **D. Framework Organic - CrearObjeto/CrearObjetoPorProducto**
```foxpro
* Busca archivo directo
loObjeto = _screen.Zoo.CrearObjeto("MiClase")  && ? F12 aquí

* Busca con prefijo ColorYTalle_MiClase.prg
loObjeto = _screen.Zoo.CrearObjetoPorProducto("MiClase")  && ? F12 aquí
```

#### **E. Definiciones de Clase**
```foxpro
* Si el cursor está sobre "MiClase" en la definición, 
* puede buscar otras referencias o archivos
define class MiClase as Custom  && ? F12 aquí
```

### 3. **Comportamiento Esperado**

#### ? **Casos de éxito**
- **Definición única**: Se abre el archivo con la definición de la clase, cursor posicionado en `define class`
- **Múltiples definiciones**: Muestra un popup con lista de opciones para elegir
- **Archivo actual**: Si la clase está en el mismo archivo, navega a esa línea
- **Priorización**: Muestra primero los resultados más específicos (Organic patterns)

#### ?? **Casos Especiales**
- **No encontrado**: No muestra error, comportamiento estándar de VS Code
- **Archivo de la misma clase**: Prioriza la definición en el archivo actual
- **Archivos similares**: Distingue entre `MiClase.prg` y `ent_MiClase.prg`

---

## Testing y Validación

### Estructura de Tests

```typescript
// src/test/suite/extension.test.ts
suite('Extension Test Suite', () => {
    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('foxpro-extensions.foxpro-go-to-definition'));
    });

    test('Should activate on .prg files', async () => {
        const extension = vscode.extensions.getExtension('foxpro-extensions.foxpro-go-to-definition');
        if (extension) {
            await extension.activate();
            assert.ok(extension.isActive);
        }
    });
});
```

### Casos de Prueba Críticos

#### **1. Detección de Patterns**
```foxpro
* Test: Detectar createobject
loObj = createobject("TestClass")

* Test: Detectar newobject  
loObj = newobject("TestClass", "test.prg")

* Test: Detectar Organic patterns
loEntity = _screen.Zoo.InstanciarEntidad("TestEntity")
loComp = _screen.Zoo.InstanciarComponente("TestComponent")
```

#### **2. Búsqueda en Archivos**
- ? Buscar en archivo actual
- ? Buscar archivo directo (`TestClass.prg`)
- ? Buscar con patterns Organic
- ? Búsqueda general en workspace

#### **3. Manejo de Errores**
- ? Archivo no encontrado
- ? Workspace no válido
- ? Clase no definida
- ? Multiple definiciones

### Ejecutar Tests
```bash
# Tests unitarios
npm test

# Tests de integración
npm run test-integration

# Coverage
npm run coverage
```

---

## Casos de Uso Reales

### Escenario 1: Proyecto Felino - Entidades

```foxpro
* En: /Felino/Ventas/ent_ComprobanteDeVentas.prg
function CrearCliente()
    local loCliente as Object
    
    * F12 aquí encontrará en orden:
    * 1. entColorYTalle_Cliente.prg
    * 2. ent_Cliente.prg  
    * 3. din_EntidadCliente.prg
    loCliente = _screen.Zoo.InstanciarEntidad("Cliente")
    
    return loCliente
endfunc
```

### Escenario 2: Sistema de Componentes

```foxpro
* En: /ColorYTalle/Altas/ent_Cotizacion.prg
function InicializarComponentes()
    
    * F12 aquí buscará: componenteValidador.prg
    this.oValidador = _screen.Zoo.InstanciarComponente("Validador")
    
    * F12 aquí buscará: componenteFiscal.prg
    this.oFiscal = _screen.Zoo.InstanciarComponente("Fiscal")
    
endfunc
```

### Escenario 3: Clases Personalizadas del Producto

```foxpro
* En cualquier archivo del proyecto ColorYTalle
function CrearReporte()
    
    * F12 aquí buscará: ColorYTalle_ReporteVentas.prg
    loReporte = _screen.Zoo.CrearObjetoPorProducto("ReporteVentas")
    
    return loReporte
endfunc
```

---

## Limitaciones y Consideraciones

### ?? **Limitaciones Actuales**
- **Clases din�micas**: No soporta clases definidas dinámicamente en tiempo de ejecución
- **Variables como nombres**: No resuelve `loClass = "MiClase"` ? `createobject(loClass)`
- **Includes complejos**: No sigue cadenas de SET PROCEDURE TO o #INCLUDE
- **Case sensitivity**: Búsqueda case-insensitive puede generar falsos positivos ocasionales

### ? **Consideraciones de Performance**
- **Workspace grandes**: La búsqueda inicial puede ser lenta en proyectos muy grandes (>10,000 archivos)
- **Red/NFS**: Rendimiento reducido en sistemas de archivos de red
- **Exclusiones**: Se recomienda usar `.gitignore` para excluir carpetas innecesarias
- **Lazy loading**: La extensión solo se activa cuando se abren archivos `.prg`

### ?? **Mejores Prácticas**
- **Estructura de carpetas**: Mantener una estructura organizada mejora la velocidad de búsqueda
- **Nombres únicos**: Usar nombres de clase únicos evita ambigüedades
- **Comentarios**: Incluir comentarios con ubicaciones ayuda durante desarrollo

---

## Desarrollo y Extensibilidad

### Estructura del Código

```typescript
// src/definitionProvider.ts - Clase principal
export class FoxProDefinitionProvider implements vscode.DefinitionProvider {
    // M�todo principal llamado por VS Code
    async provideDefinition(...): Promise<vscode.Definition> {
        // 1. Extraer nombre de clase del contexto
        // 2. Determinar tipo de instanciación (standard/organic)  
        // 3. Aplicar estrategia de búsqueda correspondiente
        // 4. Retornar ubicaciones encontradas
    }
}
```

### Puntos de Extensión

#### **Agregar Nuevos Patterns**
```typescript
// En extractClassName(), agregar nuevo pattern:
const patterns = [
    // ... patterns existentes
    { regex: /mi_nuevo_pattern\s*\(\s*['"]*([a-zA-Z_][a-zA-Z0-9_]*)/i, type: 'custom' }
];
```

#### **Agregar Nuevas Estrategias de Búsqueda**
```typescript
// En findOrganicClassDefinitions(), agregar nuevo case:
switch (patternType) {
    // ... cases existentes
    case 'custom':
        organicPatterns = [`mi_prefijo_${className}.prg`];
        break;
}
```

### Mejoras Futuras Planificadas

#### ?? **Funcionalidades Avanzadas**
- **Autocompletado**: Sugerir nombres de clase disponibles
- **Find All References**: Mostrar todos los usos de una clase
- **Hover Information**: Mostrar información de la clase al pasar el mouse
- **Symbol Provider**: Integrar con el outline de VS Code

#### ?? **Mejoras de Performance**
- **Cache persistente**: Mantener índice de clases entre sesiones
- **Indexaci�n incremental**: Solo re-indexar archivos modificados
- **B�squeda paralela**: Buscar en múltiples carpetas simultáneamente

#### ?? **Configurabilidad**
- **Patterns personalizables**: Permitir agregar patterns via configuración
- **Exclusiones configurables**: Carpetas y archivos a ignorar
- **Prioridades**: Configurar orden de búsqueda por proyecto

---

## Solución de Problemas

### Problemas Comunes

#### **? La extensión no se activa**
```bash
# Solución 1: Verificar asociación de archivos
# En settings.json:
"files.associations": {
    "*.prg": "foxpro"
}

# Solución 2: Verificar que la extensión está instalada
code --list-extensions | grep foxpro
```

#### **? F12 no encuentra definiciones**
```bash
# Debug: Activar logging
"foxpro.debug.enabled": true

# Verificar en Output panel: "FoxPro Go to Definition"
# Buscar mensajes como: "Buscando definición para clase: MiClase"
```

#### **? B�squeda muy lenta**
```bash
# Solución: Agregar exclusiones en .gitignore
node_modules/
dist/
build/
*.tmp

# O configurar exclusiones específicas
"search.exclude": {
    "**/temp": true,
    "**/backup": true
}
```

### Debugging de la Extensi�n

```typescript
// Habilitar logging detallado en definitionProvider.ts
console.log(`Buscando definición para clase: ${className}`);
console.log(`Tipo de pattern detectado: ${patternType}`);
console.log(`Patterns a buscar: ${organicPatterns.join(', ')}`);
```

### Reporte de Errores

Para reportar problemas:
1. **Reproducir** el problema con logging activado
2. **Capturar** los logs del Output panel
3. **Incluir** ejemplo de código que falla
4. **Especificar** versión de VS Code y extensión

---

## Contribución

### Preparar Entorno de Desarrollo

```bash
# Fork y clonar repositorio
git clone <tu-fork> ~/extensionF12foxpro
cd ~/extensionF12foxpro

# Instalar dependencias
npm install

# Abrir en VS Code para desarrollo
code .

# Ejecutar en modo debug (F5)
```

### Guías de Contribución

#### **Agregar Nuevos Patterns**
1. Modificar `extractClassName()` para detectar el nuevo pattern
2. Agregar lógica en `findOrganicClassDefinitions()` para el nuevo tipo
3. Crear tests unitarios para verificar funcionamiento
4. Actualizar documentación

#### **Mejoras de Performance**
1. Medir performance actual con `console.time()`
2. Identificar bottlenecks en búsqueda de archivos
3. Implementar optimización
4. Verificar que no se rompe funcionalidad existente

#### **Tests**
```bash
# Ejecutar tests existentes
npm test

# Agregar nuevos tests en src/test/suite/
# Seguir pattern existente
```

### Proceso de Contribuci�n
1. **Fork** el repositorio
2. **Crear** rama para la feature: `git checkout -b feature/nueva-funcionalidad`
3. **Implementar** cambios con tests
4. **Commit** cambios: `git commit -am 'Agregar nueva funcionalidad'`
5. **Push** rama: `git push origin feature/nueva-funcionalidad`
6. **Crear** Pull Request

---

## Licencia y Créditos

### Licencia
MIT License - Ver archivo LICENSE para más detalles.

### Créditos
- **Visual FoxPro**: Microsoft Visual FoxPro 9.0
- **Framework Organic**: Sistema interno de desarrollo
- **VS Code API**: Microsoft Visual Studio Code Extension API
- **TypeScript**: Microsoft TypeScript

### Agradecimientos
- Comunidad de Visual FoxPro
- Equipo de VS Code
- Contributors del proyecto

---

## Información de Versión

### v1.0.0 (Actual)
- ? Implementación inicial completa
- ? Soporte para patterns estándar de FoxPro
- ? Soporte completo para framework Organic
- ? Tests unitarios básicos
- ? Documentación completa

### Roadmap v1.1.0
- ?? Cache persistente de definiciones
- ?? Mejoras de performance para workspaces grandes
- ?? Configuración avanzada de patterns

### Roadmap v1.2.0
- ?? Find All References
- ?? Hover information
- ?? Autocompletado de clases

---

**¡La extensión está lista para usar!** ??

Para comenzar:
1. Compila el proyecto: `npm run compile`
2. Abre VS Code y presiona F5 para ejecutar en modo desarrollo
3. Abre cualquier archivo .prg y prueba F12 sobre un nombre de clase