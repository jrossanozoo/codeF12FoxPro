*-------------------------------------------------------------------------------------------------
* Ejemplo de entidad OrdenDeProduccion del framework Organic
* Este archivo debería ser encontrado cuando se hace F12 sobre InstanciarEntidad("OrdenDeProduccion")
*-------------------------------------------------------------------------------------------------

define class ent_OrdenDeProduccion as Custom
	
	cNumero = ""
	dFecha = {}
	nCantidad = 0
	cEstado = "Pendiente"
	
	function Init()
		this.dFecha = date()
		return dodefault()
	endfunc
	
	function ProcesarOrden()
		* Lógica de procesamiento de la orden
		this.cEstado = "En Proceso"
		return .T.
	endfunc
	
	function FinalizarOrden()
		* Finalizar la orden de producción
		this.cEstado = "Finalizada"
		return .T.
	endfunc

enddefine