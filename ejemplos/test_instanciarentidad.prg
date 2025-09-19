*-------------------------------------------------------------------------------------------------
* Archivo de prueba para InstanciarEntidad()
* Debe encontrar ent_Factura.prg cuando se hace F12
*-------------------------------------------------------------------------------------------------

local loFactura as Object
local loComponente as Object
local loProducto as Object

* ===== PRUEBAS PARA INSTANCIARENTIDAD() =====
* Esta línea debería encontrar la definición en ent_Factura.prg
loFactura = _screen.zoo.InstanciarEntidad("Factura")

* También debería funcionar con mayúsculas/minúsculas
local loFactura2 as Object
loFactura2 = _screen.zoo.instanciarentidad("factura")

* ===== PRUEBAS PARA INSTANCIARCOMPONENTE() =====
* Esta línea debería encontrar la definición en componenteValidador.prg
loComponente = _screen.zoo.InstanciarComponente("Validador")

* ===== PRUEBAS PARA CREAROBJETOPORPRODUCTO() =====
* Esta línea debería encontrar la definición en ColorYTalle_ReporteVentas.prg
loProducto = _screen.zoo.CrearObjetoPorProducto("ReporteVentas")

* ===== MOSTRAR RESULTADOS =====
? "Factura creada:", iif(isnull(loFactura), "NO ENCONTRADA", "OK")
? "Componente creado:", iif(isnull(loComponente), "NO ENCONTRADO", "OK")
? "Producto creado:", iif(isnull(loProducto), "NO ENCONTRADO", "OK")

*-------------------------------------------------------------------------------------------------
* INSTRUCCIONES DE PRUEBA:
* 1. Abrir este archivo en VS Code
* 2. Colocar el cursor sobre "Factura" en la línea InstanciarEntidad("Factura")
* 3. Presionar F12 o Ctrl+Click
* 4. Debería abrir el archivo ent_Factura.prg y mostrar la definición de la clase
* 
* Repetir lo mismo para "Validador" y "ReporteVentas"
*-------------------------------------------------------------------------------------------------