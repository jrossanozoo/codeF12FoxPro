*-------------------------------------------------------------------------------------------------
* Ejemplo de clase estándar
* Este archivo debería ser encontrado cuando se hace F12 sobre "MiClase"
*-------------------------------------------------------------------------------------------------

define class MiClase as Custom
	
	cNombre = ""
	nVersion = 1.0
	
	function Init()
		this.cNombre = "MiClase Ejemplo"
		return dodefault()
	endfunc
	
	function MiMetodo()
		return "Método de ejemplo"
	endfunc
	
enddefine