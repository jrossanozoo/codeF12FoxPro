# Instrucciones de Prueba - FoxPro Go to Definition Extension

## C�mo probar la extensi�n

### 1. Compilar y ejecutar
```bash
cd ~/extensionF12foxpro
npm run compile
```

### 2. Ejecutar en VS Code
- Abrir VS Code en la carpeta `~/extensionF12foxpro`
- Presionar `F5` para ejecutar en modo desarrollo
- Se abrir� una nueva ventana de VS Code con la extensi�n cargada

### 3. Configurar asociaci�n de archivos
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
- VS Code deber�a reconocerlo como tipo "foxpro"

### 5. Probar funcionalidad F12

#### Casos de prueba espec�ficos:

**Test 1 - Instanciaci�n est�ndar:**
- L�nea 18: `loObjeto = createobject("MiClase")`
- Posicionar cursor sobre "MiClase" y presionar F12
- ? Deber�a abrir `ejemplos/MiClase.prg` en la l�nea `define class MiClase`

**Test 2 - Framework Organic - Entidad:**
- L�nea 34: `loEntidad = _screen.Zoo.InstanciarEntidad("Factura")`
- Posicionar cursor sobre "Factura" y presionar F12  
- ? Deber�a abrir `ejemplos/ent_Factura.prg` en la l�nea `define class ent_Factura`

**Test 3 - Framework Organic - Componente:**
- L�nea 39: `loComponente = _screen.Zoo.InstanciarComponente("Validador")`
- Posicionar cursor sobre "Validador" y presionar F12
- ? Deber�a abrir `ejemplos/componenteValidador.prg` en la l�nea `define class componenteValidador`

**Test 4 - Framework Organic - Producto:**
- L�nea 44: `loProducto = _screen.Zoo.CrearObjetoPorProducto("ReporteVentas")`  
- Posicionar cursor sobre "ReporteVentas" y presionar F12
- ? Deber�a abrir `ejemplos/ColorYTalle_ReporteVentas.prg` en la l�nea `define class ColorYTalle_ReporteVentas`

**Test 5 - Clase en mismo archivo:**
- L�nea 77: `loEjemplo = createobject("EjemploClase")`
- Posicionar cursor sobre "EjemploClase" y presionar F12
- ? Deber�a ir a la l�nea 54 del mismo archivo donde est� `define class EjemploClase`

### 6. Verificar logging (debugging)
- Abrir Output panel (Ver > Output)
- Seleccionar "FoxPro Go to Definition" en el dropdown
- Deber�an aparecer mensajes como: `Buscando definici�n para clase: MiClase`

### 7. Casos edge para probar
- Nombres en may�sculas/min�sculas
- Clases que no existen (no deber�a mostrar error)
- M�ltiples definiciones (deber�a mostrar lista)

## Estructura de archivos de prueba

```
ejemplos/
??? ejemplo_test.prg              # Archivo principal de pruebas
??? MiClase.prg                   # Clase est�ndar
??? ent_Factura.prg              # Entidad Organic
??? componenteValidador.prg       # Componente Organic  
??? ColorYTalle_ReporteVentas.prg # Producto Organic
```

## Troubleshooting

**Si F12 no funciona:**
1. Verificar que el archivo est� asociado con "foxpro" (esquina inferior derecha)
2. Verificar en Output > "FoxPro Go to Definition" si hay mensajes de error
3. Verificar que la extensi�n est� cargada en Extensions panel

**Si no encuentra las clases:**
1. Verificar que los archivos de ejemplo est�n en `ejemplos/`
2. Verificar que VS Code tenga acceso a esa carpeta
3. Probar con logging habilitado para ver qu� archivos est� buscando