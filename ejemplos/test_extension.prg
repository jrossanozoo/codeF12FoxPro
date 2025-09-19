*-------------------------------------------------------------------------------------------------
* Archivo de prueba para verificar que funciona la nueva lógica de la extensión
*-------------------------------------------------------------------------------------------------

function TestearExtension()
    local loObjeto as Object
    local loEntidad as Object
    local loComponente as Object
    local loProducto as Object
    
    * Casos que DEBEN funcionar - F12 debería buscar:
    
    * 1. createobject("MiClase") -> buscar MiClase.prg o define class MiClase
    loObjeto = createobject("MiClase")
    
    * 2. newobject("Cliente", "entidades.prg") -> buscar en entidades.prg por define class Cliente
    loObjeto = newobject("Cliente", "entidades.prg")
    
    * 3. _screen.Zoo.InstanciarEntidad("Factura") -> buscar:
    *    entColorYTalle_Factura.prg, ent_Factura.prg, din_EntidadFactura.prg
    loEntidad = _screen.Zoo.InstanciarEntidad("Factura")
    
    * 4. _screen.Zoo.InstanciarComponente("Validador") -> buscar componenteValidador.prg
    loComponente = _screen.Zoo.InstanciarComponente("Validador")
    
    * 5. _screen.Zoo.CrearObjetoPorProducto("ReporteVentas") -> buscar ColorYTalle_ReporteVentas.prg
    loProducto = _screen.Zoo.CrearObjetoPorProducto("ReporteVentas")
    
    * Casos que NO deben funcionar - F12 no debería hacer nada:
    
    * Variables normales
    local lcTexto as String
    lcTexto = "Hola mundo"  && F12 aquí no debe hacer nada
    
    * Funciones que no son de instanciación
    lcTexto = upper("texto")  && F12 aquí no debe hacer nada
    
    * Comentarios
    * MiClase && F12 aquí no debe hacer nada
    
    return .T.
endfunc