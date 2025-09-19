*-------------------------------------------------------------------------------------------------
* Archivo de prueba específico para InstanciarEntidad("OrdenDeProduccion")
* Debe encontrar ent_ordendeproduccion.prg 
*-------------------------------------------------------------------------------------------------

local loOrden as Object

* ===== CASOS DE PRUEBA PARA ORDENDEPRODUCCION =====

* CASO 1: Cursor en cualquier parte de la línea debería funcionar
loOrden = _screen.zoo.InstanciarEntidad("OrdenDeProduccion")

* CASO 2: Con mayúsculas y minúsculas mezcladas
local loOrden2 as Object
loOrden2 = _screen.zoo.instanciarentidad("ordendeproduccion")

* CASO 3: Todo en mayúsculas
local loOrden3 as Object  
loOrden3 = _screen.zoo.INSTANCIARENTIDAD("ORDENDEPRODUCCION")

* CASO 4: Espacios extras
local loOrden4 as Object
loOrden4 = _screen.zoo.InstanciarEntidad( "OrdenDeProduccion" )

* ===== OTRAS PRUEBAS DE ENTIDADES =====

* Debe encontrar ent_factura.prg
local loFactura as Object
loFactura = _screen.zoo.InstanciarEntidad("Factura")

* ===== MOSTRAR RESULTADOS =====
? "Orden creada:", iif(isnull(loOrden), "NO ENCONTRADA", "OK")
? "Factura creada:", iif(isnull(loFactura), "NO ENCONTRADA", "OK")

*-------------------------------------------------------------------------------------------------
* INSTRUCCIONES DE PRUEBA:
* 
* 1. Colocar el cursor EN CUALQUIER PARTE de estas líneas:
*    - Sobre "_screen" 
*    - Sobre "zoo"
*    - Sobre "InstanciarEntidad" 
*    - Sobre "OrdenDeProduccion" (dentro de las comillas)
*    - Sobre los paréntesis
* 
* 2. Presionar F12 en cualquiera de esas posiciones
* 
* 3. SIEMPRE debería ir a ent_ordendeproduccion.prg y mostrar la clase ent_OrdenDeProduccion
*
* 4. NO debería dar error "no encuentra instanciarentidad"
*-------------------------------------------------------------------------------------------------