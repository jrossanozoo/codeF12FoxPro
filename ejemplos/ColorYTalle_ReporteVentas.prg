*-------------------------------------------------------------------------------------------------
* Ejemplo de clase específica del producto ColorYTalle
* Este archivo debería ser encontrado cuando se hace F12 sobre CrearObjetoPorProducto("ReporteVentas")
*-------------------------------------------------------------------------------------------------

define class ColorYTalle_ReporteVentas as Custom
	
	cTitulo = ""
	dFechaDesde = {}
	dFechaHasta = {}
	aResultados[1]
	
	function Init()
		this.cTitulo = "Reporte de Ventas ColorYTalle"
		this.dFechaDesde = date() - 30
		this.dFechaHasta = date()
		return dodefault()
	endfunc
	
	function GenerarReporte()
		local lnFilas as Integer
		lnFilas = 0
		
		* Lógica para generar reporte
		dimension this.aResultados[100, 5]
		lnFilas = this.ObtenerDatos()
		
		return lnFilas
	endfunc
	
	function ObtenerDatos()
		* Simulación de obtener datos
		return 50
	endfunc
	
	function ExportarExcel(tcArchivo)
		* Lógica de exportación
		return .T.
	endfunc
	
enddefine