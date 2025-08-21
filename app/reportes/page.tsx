"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  Calendar,
  Download,
  FileText,
  FileSpreadsheet,
  FileImage,
  ShoppingCart,
  AlertTriangle,
  Target,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { useToast } from "@/hooks/use-toast"
import { ChartTooltip } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, Pie, PieChart, Cell, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { DateRange } from "react-day-picker"
import type { JSX } from "react/jsx-runtime"
import { metricsService, type ProductoMasVendido } from "@/lib/metrics"
import { financialMetricsService, type ProductoFinanciero, type BalanceFinanciero, type MetricasFinancieras } from "@/lib/financial-metrics"
import { FinancialBalance } from "@/components/financial-balance"
import { ProductProfitability } from "@/components/product-profitability"
import { MarginAlerts } from "@/components/margin-alerts"
import { useMarginAlerts } from "@/hooks/use-margin-alerts"
import { AlertsPanel } from "@/components/alerts-panel"
import { DateFilter } from "@/components/ui/date-filter"

interface MetricaData {
  valor: number
  cambio: number
  tipo: "aumento" | "disminucion"
}

interface MetricasReporte {
  ventasTotales: MetricaData
  pedidos: MetricaData
  clientesNuevos: MetricaData
  ticketPromedio: MetricaData
  tasaConversion: MetricaData
}

// Tipos locales para reportes
interface VentaPorPeriodo {
  periodo: string
  ventas: number
  ingresos: number
}

interface CategoriaVenta {
  categoria: string
  ventas: number
  ingresos: number
}

interface VentaPorMes {
  mes: string
  ventas: number
  ingresos: number
}

interface ReporteExportData {
  periodo: string
  fechaInicio: string | null
  fechaFin: string | null
  fecha: string
  metricas: MetricasReporte
  ventas: readonly VentaPorPeriodo[]
  productos: readonly ProductoMasVendido[]
  categorias: readonly CategoriaVenta[]
}

export default function ReportesPage() {
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("semana")
  const [categoriaFiltro, setCategoriaFiltro] = useState("todas")
  const [fechaPersonalizada, setFechaPersonalizada] = useState<DateRange | undefined>()
  const [fechaFiltroRapido, setFechaFiltroRapido] = useState<DateRange | undefined>()
  const [usarFechaPersonalizada, setUsarFechaPersonalizada] = useState(false)
  const [formatoExportacion, setFormatoExportacion] = useState("json")
  const [loading, setLoading] = useState(true)
  const [ventasPorPeriodo, setVentasPorPeriodo] = useState<VentaPorPeriodo[]>([])
  const [ventasPorMes, setVentasPorMes] = useState<VentaPorMes[]>([])
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([])
  const [categoriaVentas, setCategoriaVentas] = useState<CategoriaVenta[]>([])
  const [metricas, setMetricas] = useState<MetricasReporte>({
    ventasTotales: { valor: 0, cambio: 0, tipo: "aumento" },
    pedidos: { valor: 0, cambio: 0, tipo: "aumento" },
    clientesNuevos: { valor: 0, cambio: 0, tipo: "aumento" },
    ticketPromedio: { valor: 0, cambio: 0, tipo: "aumento" },
    tasaConversion: { valor: 0, cambio: 0, tipo: "aumento" },
  })
  
  // Nuevas métricas financieras
  const [productosFinancieros, setProductosFinancieros] = useState<ProductoFinanciero[]>([])
  const [balanceFinanciero, setBalanceFinanciero] = useState<BalanceFinanciero | null>(null)
  const [metricasFinancieras, setMetricasFinancieras] = useState<MetricasFinancieras | null>(null)

  const { toast } = useToast()
  
  // Hook para alertas de márgenes
  const { generarAlertas, obtenerEstadisticas } = useMarginAlerts()
  
  // Estado para el panel de alertas
  const [alertsPanelOpen, setAlertsPanelOpen] = useState(false)

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        
        // Determinar qué fechas usar
        let fechaInicio: Date | undefined
        let fechaFin: Date | undefined
        
        if (usarFechaPersonalizada && fechaPersonalizada?.from && fechaPersonalizada?.to) {
          fechaInicio = fechaPersonalizada.from
          fechaFin = fechaPersonalizada.to
        } else if (fechaFiltroRapido?.from && fechaFiltroRapido?.to) {
          fechaInicio = fechaFiltroRapido.from
          fechaFin = fechaFiltroRapido.to
        }
        
        // Obtener datos de métricas básicas
        const productos = await metricsService.getProductosMasVendidos(fechaInicio, fechaFin)
        
        // Obtener datos financieros
        const productosFin = await financialMetricsService.getProductosFinancieros(fechaInicio, fechaFin)
        const balance = await financialMetricsService.getBalanceFinanciero(fechaInicio, fechaFin)
        const metricasFin = await financialMetricsService.getMetricasFinancieras(fechaInicio, fechaFin)
        
        // Generar datos mock para las métricas faltantes
        const ventasPeriodo: VentaPorPeriodo[] = [
          { periodo: 'Lunes', ventas: 4, ingresos: 439996 },
          { periodo: 'Martes', ventas: 5, ingresos: 519995 },
          { periodo: 'Miércoles', ventas: 4, ingresos: 399996 },
          { periodo: 'Jueves', ventas: 5, ingresos: 519995 },
          { periodo: 'Viernes', ventas: 6, ingresos: 629994 },
          { periodo: 'Sábado', ventas: 3, ingresos: 299997 },
          { periodo: 'Domingo', ventas: 3, ingresos: 299997 }
        ]
        
        const ventasMes: VentaPorMes[] = [
          { mes: 'Enero', ventas: 16, ingresos: 1599994 },
          { mes: 'Febrero', ventas: 14, ingresos: 1399994 }
        ]
        
        const categorias: CategoriaVenta[] = [
          { categoria: 'Running', ventas: 8, ingresos: 799992 },
          { categoria: 'Basketball', ventas: 6, ingresos: 599994 },
          { categoria: 'Lifestyle', ventas: 6, ingresos: 599994 },
          { categoria: 'Training', ventas: 4, ingresos: 399996 },
          { categoria: 'Skate', ventas: 3, ingresos: 299997 },
          { categoria: 'Tennis', ventas: 3, ingresos: 299997 }
        ]
        
        const metricasData: MetricasReporte = {
          ventasTotales: { valor: 2999988, cambio: 15, tipo: "aumento" },
          pedidos: { valor: 30, cambio: 12, tipo: "aumento" },
          clientesNuevos: { valor: 10, cambio: 8, tipo: "aumento" },
          ticketPromedio: { valor: 99999, cambio: 5, tipo: "aumento" },
          tasaConversion: { valor: 78, cambio: 3, tipo: "aumento" }
        }

        setVentasPorPeriodo(ventasPeriodo)
        setVentasPorMes(ventasMes)
        setProductosMasVendidos(productos)
        setCategoriaVentas(categorias)
        setMetricas(metricasData)
        
        // Establecer datos financieros
        setProductosFinancieros(productosFin)
        setBalanceFinanciero(balance)
        setMetricasFinancieras(metricasFin)
        
        // Generar alertas automáticas para productos con márgenes bajos
        if (productosFin.length > 0) {
          const productosParaAlertas = productosFin.map(p => ({
            id: p.id,
            nombre: p.nombre,
            precio: p.precioVenta,
            costo: p.precioCosto,
            porcentajeMargen: p.porcentajeMargen,
            categoria: "General"
          }))
          
          generarAlertas(productosParaAlertas)
        }
      } catch (error) {
        console.error("Error cargando datos:", error)
        toast({
          title: "Error",
          description: "Error al cargar los datos del reporte",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    cargarDatos()
  }, [periodoSeleccionado, usarFechaPersonalizada, fechaPersonalizada, fechaFiltroRapido, toast])

  const getTrendIcon = (tipo: "aumento" | "disminucion"): JSX.Element => {
    return tipo === "aumento" ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    )
  }

  const getTrendColor = (tipo: "aumento" | "disminucion"): string => {
    return tipo === "aumento" ? "text-green-600" : "text-red-600"
  }

  const exportarReporte = (): void => {
    const reporteData: ReporteExportData = {
      periodo: usarFechaPersonalizada ? "personalizado" : periodoSeleccionado,
      fechaInicio: fechaPersonalizada?.from ? format(fechaPersonalizada.from, "yyyy-MM-dd") : null,
      fechaFin: fechaPersonalizada?.to ? format(fechaPersonalizada.to, "yyyy-MM-dd") : null,
      fecha: new Date().toLocaleDateString("es-AR"),
      metricas,
      ventas: ventasPorPeriodo,
      productos: productosMasVendidos,
      categorias: categoriaVentas,
    }

    let dataStr = ""
    let mimeType = ""
    let extension = ""

    switch (formatoExportacion) {
      case "json":
        dataStr = JSON.stringify(reporteData, null, 2)
        mimeType = "application/json"
        extension = "json"
        break
      case "csv":
        const csvHeaders = "Período,Ventas,Ingresos ($)\n"
        const csvData = ventasPorPeriodo
          .map((item: VentaPorPeriodo) => `${item.periodo},${item.ventas},${item.ingresos}`)
          .join("\n")
        dataStr = csvHeaders + csvData
        mimeType = "text/csv"
        extension = "csv"
        break
      case "txt":
        dataStr = `REPORTE DE VENTAS\n`
        dataStr += `Período: ${usarFechaPersonalizada ? "Personalizado" : periodoSeleccionado}\n`
        dataStr += `Fecha: ${new Date().toLocaleDateString("es-AR")}\n\n`
        dataStr += `MÉTRICAS:\n`
        dataStr += `Ventas Totales: $${metricas.ventasTotales.valor.toLocaleString()}\n`
        dataStr += `Pedidos: ${metricas.pedidos.valor}\n`
        dataStr += `Clientes Nuevos: ${metricas.clientesNuevos.valor}\n\n`
        dataStr += `VENTAS POR PERÍODO:\n`
        ventasPorPeriodo.forEach((item: VentaPorPeriodo) => {
          dataStr += `${item.periodo}: ${item.ventas} ventas ($${item.ingresos.toLocaleString()})\n`
        })
        mimeType = "text/plain"
        extension = "txt"
        break
      default:
        dataStr = JSON.stringify(reporteData, null, 2)
        mimeType = "application/json"
        extension = "json"
    }

    const dataBlob = new Blob([dataStr], { type: mimeType })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    const fechaSufijo =
      usarFechaPersonalizada && fechaPersonalizada?.from
        ? `${format(fechaPersonalizada.from, "yyyy-MM-dd")}_${fechaPersonalizada?.to ? format(fechaPersonalizada.to, "yyyy-MM-dd") : "actual"}`
        : periodoSeleccionado
    link.download = `reporte-${fechaSufijo}-${new Date().toISOString().split("T")[0]}.${extension}`
    link.click()

    toast({
      title: "Reporte exportado",
      description: `Reporte exportado en formato ${formatoExportacion.toUpperCase()} exitosamente`,
    })
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-muted-foreground">Cargando reportes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-card-foreground">Reportes y Métricas</h1>
                  <p className="text-sm text-indigo-600">Analiza el rendimiento de tu negocio</p>
                  {/* Indicador de alertas */}
                  {obtenerEstadisticas().tieneAlertas && (
                    <div className="flex items-center space-x-2 mt-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-xs text-red-600 font-medium">
                        {obtenerEstadisticas().noLeidas} alerta{obtenerEstadisticas().noLeidas !== 1 ? 's' : ''} pendiente{obtenerEstadisticas().noLeidas !== 1 ? 's' : ''}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setAlertsPanelOpen(true)}
                        className="text-xs bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                      >
                        Ver Alertas
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <DateFilter
                  onDateRangeChange={(range) => {
                    if (usarFechaPersonalizada) {
                      setFechaPersonalizada(range)
                    } else {
                      setFechaFiltroRapido(range)
                    }
                  }}
                  onQuickFilterChange={(value) => {
                    if (value === "personalizado") {
                      setUsarFechaPersonalizada(true)
                      setFechaFiltroRapido(undefined)
                    } else {
                      setUsarFechaPersonalizada(false)
                      setPeriodoSeleccionado(value)
                      // Limpiar fechas personalizadas cuando se usa un filtro rápido
                      setFechaPersonalizada(undefined)
                    }
                  }}
                  selectedRange={usarFechaPersonalizada ? fechaPersonalizada : fechaFiltroRapido}
                  selectedQuickFilter={usarFechaPersonalizada ? "personalizado" : periodoSeleccionado}
                />

                {(usarFechaPersonalizada || periodoSeleccionado !== "semana") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setUsarFechaPersonalizada(false)
                      setPeriodoSeleccionado("semana")
                      setFechaPersonalizada(undefined)
                      setFechaFiltroRapido(undefined)
                    }}
                    className="bg-transparent text-xs"
                  >
                    Limpiar Filtros
                  </Button>
                )}

                <Select value={formatoExportacion} onValueChange={setFormatoExportacion}>
                  <SelectTrigger className="w-full sm:w-28">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="json">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        JSON
                      </div>
                    </SelectItem>
                    <SelectItem value="csv">
                      <div className="flex items-center">
                        <FileSpreadsheet className="mr-2 h-4 w-4" />
                        CSV
                      </div>
                    </SelectItem>
                    <SelectItem value="txt">
                      <div className="flex items-center">
                        <FileText className="mr-2 h-4 w-4" />
                        TXT
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportarReporte}
                  className="w-full sm:w-auto bg-transparent"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>
        </header>

        {usarFechaPersonalizada && fechaPersonalizada?.from && (
          <div className="bg-blue-50 border-b border-blue-200 px-4 py-2">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-blue-700">
                <Calendar className="inline h-4 w-4 mr-1" />
                Mostrando datos desde {format(fechaPersonalizada.from, "dd/MM/yyyy", { locale: es })}
                {fechaPersonalizada.to && <> hasta {format(fechaPersonalizada.to, "dd/MM/yyyy", { locale: es })}</>}
              </p>
            </div>
          </div>
        )}

        {!usarFechaPersonalizada && fechaFiltroRapido?.from && (
          <div className="bg-green-50 border-b border-green-200 px-4 py-2">
            <div className="max-w-7xl mx-auto">
              <p className="text-sm text-green-700">
                <Calendar className="inline h-4 w-4 mr-1" />
                Mostrando datos del período: <strong>{periodoSeleccionado === "hoy" ? "Hoy" : 
                  periodoSeleccionado === "ayer" ? "Ayer" :
                  periodoSeleccionado === "semana" ? "Esta Semana" :
                  periodoSeleccionado === "mes" ? "Este Mes" :
                  periodoSeleccionado === "año" ? "Este Año" : periodoSeleccionado}</strong>
                {fechaFiltroRapido.from && (
                  <> desde {format(fechaFiltroRapido.from, "dd/MM/yyyy", { locale: es })}
                  {fechaFiltroRapido.to && <> hasta {format(fechaFiltroRapido.to, "dd/MM/yyyy", { locale: es })}</>}</>
                )}
              </p>
            </div>
          </div>
        )}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Totales</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">${metricas.ventasTotales.valor.toLocaleString()}</div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.ventasTotales.tipo)}`}
                >
                  {getTrendIcon(metricas.ventasTotales.tipo)}
                  <span className="ml-1">{metricas.ventasTotales.cambio >= 0 ? '+' : ''}{metricas.ventasTotales.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos</CardTitle>
                <ShoppingCart className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{metricas.pedidos.valor}</div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.pedidos.tipo)}`}
                >
                  {getTrendIcon(metricas.pedidos.tipo)}
                  <span className="ml-1">{metricas.pedidos.cambio >= 0 ? '+' : ''}{metricas.pedidos.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Nuevos</CardTitle>
                <Users className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{metricas.clientesNuevos.valor}</div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.clientesNuevos.tipo)}`}
                >
                  {getTrendIcon(metricas.clientesNuevos.tipo)}
                  <span className="ml-1">{metricas.clientesNuevos.cambio >= 0 ? '+' : ''}{metricas.clientesNuevos.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ticket Promedio</CardTitle>
                <Package className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">
                  ${metricas.ticketPromedio.valor.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.ticketPromedio.tipo)}`}
                >
                  {getTrendIcon(metricas.ticketPromedio.tipo)}
                  <span className="ml-1">{metricas.ticketPromedio.cambio >= 0 ? '+' : ''}{metricas.ticketPromedio.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Tasa Conversión</CardTitle>
                <TrendingUp className="h-4 w-4 text-rose-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{metricas.tasaConversion.valor}%</div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.tasaConversion.tipo)}`}
                >
                  {getTrendIcon(metricas.tasaConversion.tipo)}
                  <span className="ml-1">{metricas.tasaConversion.cambio >= 0 ? '+' : ''}{metricas.tasaConversion.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            {/* Nueva métrica financiera */}
            {metricasFinancieras && (
              <Card className="bg-card border-border">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Ganancia Neta</CardTitle>
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-card-foreground">
                    ${metricasFinancieras.gananciaNeta.valor.toLocaleString()}
                  </div>
                  <div
                    className={`flex items-center text-xs mt-1 ${getTrendColor(metricasFinancieras.gananciaNeta.tipo)}`}
                  >
                    {getTrendIcon(metricasFinancieras.gananciaNeta.tipo)}
                    <span className="ml-1">{metricasFinancieras.gananciaNeta.cambio >= 0 ? '+' : ''}{metricasFinancieras.gananciaNeta.cambio}% vs anterior</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-card-foreground">
                  Ingresos y Ventas por{" "}
                  {periodoSeleccionado === "hoy"
                    ? "Hora"
                    : periodoSeleccionado === "semana"
                      ? "Día"
                      : periodoSeleccionado === "mes"
                        ? "Semana"
                        : "Mes"}
                </CardTitle>
                <CardDescription>
                  Rendimiento de ingresos y ventas en el{" "}
                  {periodoSeleccionado === "hoy" ? "día actual" : `último ${periodoSeleccionado}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[...ventasPorPeriodo]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <XAxis dataKey="periodo" fontSize={12} tickMargin={10} />
                      <YAxis fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                                <p className="font-medium text-card-foreground">{`${label}`}</p>
                                <p className="text-green-600">{`Ingresos: $${payload[0]?.value?.toLocaleString()}`}</p>
                                <p className="text-blue-600">{`Ventas: ${payload[1]?.value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="ingresos" fill="#10b981" name="Ingresos ($)" />
                      <Bar dataKey="ventas" fill="#3b82f6" name="Ventas" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-card-foreground">Tendencia Mensual</CardTitle>
                <CardDescription>Evolución de ingresos y ventas por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...ventasPorMes]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="mes" fontSize={12} tickMargin={10} />
                      <YAxis fontSize={12} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                                <p className="font-medium text-card-foreground">{`${label}`}</p>
                                <p className="text-purple-600">{`Ingresos: $${payload[0]?.value?.toLocaleString()}`}</p>
                                <p className="text-orange-600">{`Ventas: ${payload[1]?.value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line type="monotone" dataKey="ingresos" stroke="#8b5cf6" strokeWidth={3} name="Ingresos ($)" />
                      <Line type="monotone" dataKey="ventas" stroke="#f59e0b" strokeWidth={3} name="Ventas" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-card-foreground">Productos Más Vendidos</CardTitle>
                <CardDescription>Top 5 productos por cantidad vendida</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productosMasVendidos.length > 0 ? (
                    productosMasVendidos.map((producto: ProductoMasVendido, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 flex-shrink-0">
                            <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">{producto.nombre}</div>
                            <div className="text-xs text-gray-500">{producto.ventas} unidad{producto.ventas !== 1 ? 'es' : ''} vendida{producto.ventas !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <div className="text-sm font-semibold text-green-600">
                            ${producto.ingresos.toLocaleString()}
                          </div>
                          <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                            <div
                              className="h-2 rounded-full"
                              style={{
                                width: `${productosMasVendidos[0]?.ventas > 0 ? (producto.ventas / productosMasVendidos[0].ventas) * 100 : 0}%`,
                                backgroundColor: '#22c55e',
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">No hay productos vendidos aún</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-card-foreground">Ventas por Categoría</CardTitle>
                <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                                              <Pie
                          data={[...categoriaVentas]}
                          dataKey="ventas"
                          nameKey="categoria"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({ categoria, ventas }) => `${categoria}: ${ventas} venta${ventas !== 1 ? 's' : ''}`}
                          fontSize={12}
                        >
                        {categoriaVentas.map((entry: CategoriaVenta, index: number) => {
                          const colors = ['#22c55e', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#10b981']
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        })}
                      </Pie>
                                              <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-card p-3 border border-border rounded-lg shadow-lg">
                                  <p className="font-medium text-card-foreground">{payload[0]?.name}</p>
                                  <p className="text-gray-600">{`${payload[0]?.value} venta${payload[0]?.value !== 1 ? 's' : ''}`}</p>
                                </div>
                              )
                            }
                            return null
                          }}
                        />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Crecimiento del Mes</CardTitle>
                <CardDescription className="text-green-100">Comparado con el mes anterior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-bold">{metricas.ventasTotales.cambio >= 0 ? '+' : ''}{metricas.ventasTotales.cambio}%</div>
                    <div className="text-sm text-green-100">En ventas totales</div>
                  </div>
                  <TrendingUp className="h-12 w-12 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Mejor Producto</CardTitle>
                <CardDescription className="text-blue-100">Producto estrella del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-bold truncate">
                      {productosMasVendidos[0]?.nombre || "Sin datos"}
                    </div>
                    <div className="text-sm text-blue-100">
                      {productosMasVendidos[0]?.ventas || 0} unidad{(productosMasVendidos[0]?.ventas || 0) !== 1 ? 'es' : ''} vendida{(productosMasVendidos[0]?.ventas || 0) !== 1 ? 's' : ''}
                    </div>
                  </div>
                  <Package className="h-12 w-12 text-blue-200 flex-shrink-0 ml-4" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Cliente VIP</CardTitle>
                <CardDescription className="text-purple-100">Mayor comprador del mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-bold truncate">Juan Pérez</div>
                    <div className="text-sm text-purple-100">$269,997 en compras</div>
                  </div>
                  <Users className="h-12 w-12 text-purple-200 flex-shrink-0 ml-4" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Nuevas secciones financieras */}
          {balanceFinanciero && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center space-x-2">
                <DollarSign className="h-6 w-6 text-emerald-600" />
                <span>Balance Financiero</span>
              </h2>
              <FinancialBalance balance={balanceFinanciero} />
            </div>
          )}

          {productosFinancieros.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center space-x-2">
                <Target className="h-6 w-6 text-blue-600" />
                <span>Análisis de Rentabilidad</span>
              </h2>
              <ProductProfitability productos={productosFinancieros} />
            </div>
          )}

          {/* Alertas de Márgenes */}
          {productosFinancieros.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-card-foreground mb-6 flex items-center space-x-2">
                <AlertTriangle className="h-6 w-6 text-red-600" />
                <span>Alertas de Márgenes</span>
              </h2>
              <MarginAlerts 
                productos={productosFinancieros.map(p => ({
                  id: p.id,
                  nombre: p.nombre,
                  precio: p.precioVenta,
                  costo: p.precioCosto,
                  margenGanancia: p.margenGanancia,
                  porcentajeMargen: p.porcentajeMargen,
                  stock: p.ventas, // Usar ventas como stock para demo
                  categoria: "General"
                }))}
                onProductClick={(producto) => {
                  // Aquí podrías navegar al producto o abrir un modal
                  console.log("Producto seleccionado:", producto)
                }}
              />
            </div>
          )}


        </main>
      </div>
      
      {/* Panel de Alertas */}
      <AlertsPanel 
        isOpen={alertsPanelOpen}
        onClose={() => setAlertsPanelOpen(false)}
      />
    </div>
  )
}