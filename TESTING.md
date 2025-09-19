# Instrucciones de Prueba - FoxPro Go to Definition Extension

## Cómo probar la extensión

### 1. Compilar y ejecutar
```bash
cd ~/extensionF12foxpro
npm run compile
```

### 2. Ejecutar en VS Code
- Abrir VS Code en la carpeta `~/extensionF12foxpro`
- Presionar `F5` para ejecutar en modo desarrollo
- Se abrirá una nueva ventana de VS Code con la extensión cargada

### 3. Configurar asociación de archivos
En la nueva ventana, ir a Settings (Ctrl+,) y agregar:
```json
{
    "files.associations": {
        "*.prg": "foxpro"
    }
}
```

### 4. Abrir archivo de prueba
- Abrir `ejemplos/ejemplo_test.prg` en la nueva ventana
- VS Code debería reconocerlo como tipo "foxpro"

### 5. Probar funcionalidad F12

#### Casos de prueba específicos:

**Test 1 - Instanciación estándar:**
- Línea 18: `loObjeto = createobject("MiClase")`
- Posicionar cursor sobre "MiClase" y presionar F12
- ? Debería abrir `ejemplos/MiClase.prg` en la línea `define class MiClase`

**Test 2 - Framework Organic - Entidad:**
- Línea 34: `loEntidad = _screen.Zoo.InstanciarEntidad("Factura")`
- Posicionar cursor sobre "Factura" y presionar F12  
- ? Debería abrir `ejemplos/ent_Factura.prg` en la línea `define class ent_Factura`

**Test 3 - Framework Organic - Componente:**
- Línea 39: `loComponente = _screen.Zoo.InstanciarComponente("Validador")`
- Posicionar cursor sobre "Validador" y presionar F12
- ? Debería abrir `ejemplos/componenteValidador.prg` en la línea `define class componenteValidador`

**Test 4 - Framework Organic - Producto:**
- Línea 44: `loProducto = _screen.Zoo.CrearObjetoPorProducto("ReporteVentas")`  
- Posicionar cursor sobre "ReporteVentas" y presionar F12
- ? Debería abrir `ejemplos/ColorYTalle_ReporteVentas.prg` en la línea `define class ColorYTalle_ReporteVentas`

**Test 5 - Clase en mismo archivo:**
- Línea 77: `loEjemplo = createobject("EjemploClase")`
- Posicionar cursor sobre "EjemploClase" y presionar F12
- ? Debería ir a la línea 54 del mismo archivo donde está `define class EjemploClase`

### 6. Verificar logging (debugging)
- Abrir Output panel (Ver > Output)
- Seleccionar "FoxPro Go to Definition" en el dropdown
- Deberían aparecer mensajes como: `Buscando definición para clase: MiClase`

### 7. Casos edge para probar
- Nombres en mayúsculas/minúsculas
- Clases que no existen (no debería mostrar error)
- Múltiples definiciones (debería mostrar lista)

## Estructura de archivos de prueba

```
ejemplos/
??? ejemplo_test.prg              # Archivo principal de pruebas
??? MiClase.prg                   # Clase estándar
??? ent_Factura.prg              # Entidad Organic
??? componenteValidador.prg       # Componente Organic  
??? ColorYTalle_ReporteVentas.prg # Producto Organic
```

## Troubleshooting

**Si F12 no funciona:**
1. Verificar que el archivo esté asociado con "foxpro" (esquina inferior derecha)
2. Verificar en Output > "FoxPro Go to Definition" si hay mensajes de error
3. Verificar que la extensión esté cargada en Extensions panel

**Si no encuentra las clases:**
1. Verificar que los archivos de ejemplo estén en `ejemplos/`
2. Verificar que VS Code tenga acceso a esa carpeta
3. Probar con logging habilitado para ver qué archivos está buscando