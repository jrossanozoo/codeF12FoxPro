*-------------------------------------------------------------------------------------------------
* Archivo de ejemplo para probar la extensión FoxPro Go to Definition
* Instrucciones: 
* 1. Compilar la extensión: npm run compile
* 2. Presionar F5 en VS Code para ejecutar en modo desarrollo
* 3. Abrir este archivo en la nueva ventana de VS Code
* 4. Posicionar cursor sobre cualquier nombre de clase y presionar F12
*-------------------------------------------------------------------------------------------------

* === EJEMPLOS DE INSTANCIACIÓN ESTÁNDAR DE FOXPRO ===

function EjemplosEstandar()
	local loObjeto as Object
	local loCliente as Object
	
	* F12 sobre "MiClase" debería buscar MiClase.prg o define class MiClase
	loObjeto = createobject("MiClase")
	
	* F12 sobre "Cliente" debería buscar Cliente.prg o en archivo especificado
	loCliente = newobject("Cliente", "entidades.prg")
	
	return loObjeto
endfunc

* === EJEMPLOS DEL FRAMEWORK ORGANIC ===

function EjemplosOrganic()
	local loEntidad as Object
	local loComponente as Object
	local loProducto as Object
	local loGeneral as Object
	
	* INSTANCIAR ENTIDAD - Busca en orden:
	* 1) entColorYTalle_Factura.prg
	* 2) ent_Factura.prg
	* 3) din_EntidadFactura.prg
	loEntidad = _screen.Zoo.InstanciarEntidad("Factura")
	
	* INSTANCIAR COMPONENTE - Busca:
	* componenteValidador.prg
	loComponente = _screen.Zoo.InstanciarComponente("Validador")
	
	* CREAR OBJETO POR PRODUCTO - Busca:
	* ColorYTalle_ReporteVentas.prg
	loProducto = _screen.Zoo.CrearObjetoPorProducto("ReporteVentas")
	
	* CREAR OBJETO GENERAL - Busca:
	* MiClase.prg
	loGeneral = _screen.Zoo.CrearObjeto("MiClase", "archivo.prg")
	
	return loEntidad
endfunc

* === EJEMPLO DE DEFINICIÓN DE CLASE ===
* F12 sobre "EjemploClase" en cualquier parte debería venir aquí
define class EjemploClase as Custom
	
	function Init()
		* También se puede usar F12 sobre clases referenciadas dentro de métodos
		local loOtra as Object
		loOtra = createobject("OtraClase")
		return dodefault()
	endfunc
	
	function CrearSubObjetos()
		* Ejemplos dentro de métodos
		this.oValidador = _screen.Zoo.InstanciarComponente("ValidadorEjemplo")
		this.oEntidad = _screen.Zoo.InstanciarEntidad("ClienteEjemplo")
	endfunc
	
enddefine

* === EJEMPLO DE MÚLTIPLES CLASES EN EL MISMO ARCHIVO ===
define class OtraClase as Custom
	
	function Init()
		return dodefault()
	endfunc
	
enddefine

define class TerceraClase as Session
	
	function MetodoEjemplo()
		* F12 aquí debería encontrar EjemploClase en este mismo archivo
		local loEjemplo as Object
		loEjemplo = createobject("EjemploClase")
		return loEjemplo
	endfunc
	
enddefine