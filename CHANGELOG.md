# FoxPro Go to Definition - Extensión Mejorada

## Resumen de Cambios

Esta extensión ha sido completamente reescrita para ser más eficiente y específica. Ahora **SOLO funciona cuando se detectan patrones de instanciación de clases**, no para cualquier palabra.

## Funcionalidad

La extensión habilita F12 (Go to Definition) únicamente para los siguientes casos:

### 1. **FoxPro Estándar**
- `createobject("MiClase")` → Busca `MiClase.prg` o `define class MiClase`
- `newobject("Cliente")` → Busca `Cliente.prg` o `define class Cliente`  
- `newobject("Cliente", "archivo.prg")` → Busca en `archivo.prg` por `define class Cliente`

### 2. **Framework Organic**

#### InstanciarEntidad("NombreEntidad")
Busca en orden de prioridad:
1. `entColorYTalle_NombreEntidad.prg`
2. `ent_NombreEntidad.prg` 
3. `din_EntidadNombreEntidad.prg`

#### InstanciarComponente("NombreComponente")
Busca:
- `componenteNombreComponente.prg`

#### CrearObjetoPorProducto("NombreClase")
Busca en orden:
1. `ColorYTalle_NombreClase.prg` (con prefijo)
2. `NombreClase.prg` (sin prefijo)

#### CrearObjeto("NombreClase")
Busca:
- `NombreClase.prg` o `define class NombreClase`

#### CrearObjeto("NombreClase", "archivo.prg")  
Busca en:
- `archivo.prg` por `define class NombreClase`

### 3. **Definiciones de Clase**
- `define class MiClase` → Busca en el archivo actual únicamente

## Estrategia de Búsqueda

### Eficiencia Mejorada
1. **Búsqueda dirigida**: Usa el tipo de instanciación para determinar dónde buscar
2. **Orden de prioridad**: Para entidades, respeta el orden específico del framework
3. **Límites**: Búsqueda general limitada a máximo 20-50 archivos
4. **Detección estricta**: Solo funciona con patrones exactos de instanciación

### Patrones de Búsqueda
- **Archivo específico**: Si se menciona un archivo, busca solo ahí
- **Búsqueda por carpetas**: Empieza en carpeta actual, luego expande
- **Fallback limitado**: Si no encuentra con patterns específicos, búsqueda general limitada

## Lo Que NO Hace

La extensión **NO** funciona para:
- Variables normales (`local lcTexto`)
- Funciones que no son de instanciación (`upper()`, `substr()`, etc.)
- Comentarios (`* MiClase`)
- Palabras aleatorias en el código
- Llamadas a métodos (`objeto.metodo()`)

## Ejemplos de Uso

### ✅ Funciona (F12 activo)
```foxpro
* Casos donde F12 buscará definiciones:
loObj = createobject("MiClase")           && → MiClase.prg
loCliente = newobject("Cliente")          && → Cliente.prg  
loEnt = _screen.Zoo.InstanciarEntidad("Factura")  && → ent_Factura.prg
loComp = _screen.Zoo.InstanciarComponente("Validador")  && → componenteValidador.prg
loProd = _screen.Zoo.CrearObjetoPorProducto("Reporte")  && → ColorYTalle_Reporte.prg

define class MiClase as Custom  && → busca en archivo actual
```

### ❌ NO Funciona (F12 inactivo)
```foxpro
* Casos donde F12 NO hace nada:
local lcTexto
lcTexto = "MiClase"          && ❌ No es instanciación
lcTexto = upper("texto")     && ❌ No es instanciación
* MiClase                    && ❌ Es comentario
this.MiClase = "valor"       && ❌ No es instanciación
```

## Rendimiento

- **Más rápido**: No pierde tiempo buscando palabras irrelevantes
- **Menos recursos**: Búsquedas dirigidas y limitadas
- **Precisión**: Solo muestra resultados relevantes

## Archivo de Prueba

Se incluye `ejemplos/test_extension.prg` con casos de prueba para verificar el funcionamiento.

## Instalación

1. Compilar: `npx tsc -p ./`
2. Presionar F5 para ejecutar en modo desarrollo
3. Abrir un archivo .prg en la nueva ventana
4. Probar F12 sobre nombres de clase en los patrones soportados