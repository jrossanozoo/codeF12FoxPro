*-------------------------------------------------------------------------------------------------
* Ejemplo de entidad del framework Organic
* Este archivo debería ser encontrado cuando se hace F12 sobre InstanciarEntidad("Factura")
*-------------------------------------------------------------------------------------------------

define class ent_Factura as Custom
	
	cNumero = ""
	dFecha = {}
	nTotal = 0
	
	function Init()
		this.dFecha = date()
		return dodefault()
	endfunc
	
	function CalcularTotal()
		* Lógica de cálculo de total
		return this.nTotal
	endfunc
	
	function Grabar()
		* Lógica de grabado
		return .T.
	endfunc
	
enddefine