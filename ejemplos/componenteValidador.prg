*-------------------------------------------------------------------------------------------------
* Ejemplo de componente del framework Organic
* Este archivo debería ser encontrado cuando se hace F12 sobre InstanciarComponente("Validador")
*-------------------------------------------------------------------------------------------------

define class componenteValidador as Custom
	
	lActivo = .T.
	cReglas = ""
	
	function Init()
		this.cReglas = "Reglas de validaci�n"
		return dodefault()
	endfunc
	
	function ValidarDatos(txDatos)
		local llValido as Boolean
		llValido = .T.
		
		* Lógica de validación aquí
		if empty(txDatos)
			llValido = .F.
		endif
		
		return llValido
	endfunc
	
	function AgregarRegla(tcRegla)
		this.cReglas = this.cReglas + ", " + tcRegla
	endfunc
	
enddefine