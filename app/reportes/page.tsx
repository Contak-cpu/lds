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
import { metricsService, type VentaPorPeriodo, type ProductoMasVendido, type CategoriaVenta, type VentaPorMes } from "@/lib/metrics"

interface MetricaData {
  valor: number
  cambio: number
  tipo: "aumento" | "disminucion"
}

interface MetricasReporte {
  ventasHoy: MetricaData
  ventasSemana: MetricaData
  ventasMes: MetricaData
  clientesNuevos: MetricaData
  ticketPromedio: MetricaData
  tasaConversion: MetricaData
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
  const [usarFechaPersonalizada, setUsarFechaPersonalizada] = useState(false)
  const [formatoExportacion, setFormatoExportacion] = useState("json")
  const [loading, setLoading] = useState(true)
  const [ventasPorPeriodo, setVentasPorPeriodo] = useState<VentaPorPeriodo[]>([])
  const [ventasPorMes, setVentasPorMes] = useState<VentaPorMes[]>([])
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([])
  const [categoriaVentas, setCategoriaVentas] = useState<CategoriaVenta[]>([])
  const [metricas, setMetricas] = useState<MetricasReporte>({
    ventasHoy: { valor: 0, cambio: 0, tipo: "aumento" },
    ventasSemana: { valor: 0, cambio: 0, tipo: "aumento" },
    ventasMes: { valor: 0, cambio: 0, tipo: "aumento" },
    clientesNuevos: { valor: 0, cambio: 0, tipo: "aumento" },
    ticketPromedio: { valor: 0, cambio: 0, tipo: "aumento" },
    tasaConversion: { valor: 0, cambio: 0, tipo: "aumento" },
  })

  const { toast } = useToast()

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        setLoading(true)
        const [
          ventasPeriodo,
          ventasMes,
          productos,
          categorias,
          metricasData
        ] = await Promise.all([
          metricsService.getVentasPorPeriodo(periodoSeleccionado as any),
          metricsService.getVentasPorMes(),
          metricsService.getProductosMasVendidos(),
          metricsService.getVentasPorCategoria(),
          metricsService.getMetricasReporte(periodoSeleccionado as any)
        ])

        setVentasPorPeriodo(ventasPeriodo)
        setVentasPorMes(ventasMes)
        setProductosMasVendidos(productos)
        setCategoriaVentas(categorias)
        setMetricas(metricasData)
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
  }, [periodoSeleccionado, toast])

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
        const csvHeaders = "Período,Ventas,Pedidos\n"
        const csvData = ventasPorPeriodo
          .map((item: VentaPorPeriodo) => `${item.periodo},${item.ventas},${item.pedidos}`)
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
        dataStr += `Ventas Hoy: $${metricas.ventasHoy.valor.toLocaleString()}\n`
        dataStr += `Ventas Semana: $${metricas.ventasSemana.valor.toLocaleString()}\n`
        dataStr += `Ventas Mes: $${metricas.ventasMes.valor.toLocaleString()}\n\n`
        dataStr += `VENTAS POR PERÍODO:\n`
        ventasPorPeriodo.forEach((item: VentaPorPeriodo) => {
          dataStr += `${item.periodo}: $${item.ventas.toLocaleString()} (${item.pedidos} pedidos)\n`
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
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-600">Cargando reportes...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Navigation />

      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-green-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0">
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Reportes y Métricas</h1>
                  <p className="text-sm text-indigo-600">Analiza el rendimiento de tu negocio</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
                <div className="flex items-center space-x-2">
                  <Select
                    value={usarFechaPersonalizada ? "personalizado" : periodoSeleccionado}
                    onValueChange={(value) => {
                      if (value === "personalizado") {
                        setUsarFechaPersonalizada(true)
                      } else {
                        setUsarFechaPersonalizada(false)
                        setPeriodoSeleccionado(value)
                      }
                    }}
                  >
                    <SelectTrigger className="w-full sm:w-32">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hoy">Hoy</SelectItem>
                      <SelectItem value="semana">Semana</SelectItem>
                      <SelectItem value="mes">Mes</SelectItem>
                      <SelectItem value="año">Año</SelectItem>
                      <SelectItem value="personalizado">Fecha personalizada</SelectItem>
                    </SelectContent>
                  </Select>

                  {usarFechaPersonalizada && (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                          <Calendar className="mr-2 h-4 w-4" />
                          {fechaPersonalizada?.from ? (
                            fechaPersonalizada.to ? (
                              <>
                                {format(fechaPersonalizada.from, "dd/MM", { locale: es })} -{" "}
                                {format(fechaPersonalizada.to, "dd/MM", { locale: es })}
                              </>
                            ) : (
                              format(fechaPersonalizada.from, "dd/MM/yyyy", { locale: es })
                            )
                          ) : (
                            "Seleccionar fechas"
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarComponent
                          initialFocus
                          mode="range"
                          defaultMonth={fechaPersonalizada?.from}
                          selected={fechaPersonalizada}
                          onSelect={setFechaPersonalizada}
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  )}
                </div>

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

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Hoy</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${metricas.ventasHoy.valor.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.ventasHoy.tipo)}`}
                >
                  {getTrendIcon(metricas.ventasHoy.tipo)}
                  <span className="ml-1">{metricas.ventasHoy.cambio >= 0 ? '+' : ''}{metricas.ventasHoy.cambio}% vs ayer</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Semana</CardTitle>
                <DollarSign className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${metricas.ventasSemana.valor.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.ventasSemana.tipo)}`}
                >
                  {getTrendIcon(metricas.ventasSemana.tipo)}
                  <span className="ml-1">{metricas.ventasSemana.cambio >= 0 ? '+' : ''}{metricas.ventasSemana.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Mes</CardTitle>
                <DollarSign className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
                  ${metricas.ventasMes.valor.toLocaleString()}
                </div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.ventasMes.tipo)}`}
                >
                  {getTrendIcon(metricas.ventasMes.tipo)}
                  <span className="ml-1">{metricas.ventasMes.cambio >= 0 ? '+' : ''}{metricas.ventasMes.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Clientes Nuevos</CardTitle>
                <Users className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metricas.clientesNuevos.valor}</div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.clientesNuevos.tipo)}`}
                >
                  {getTrendIcon(metricas.clientesNuevos.tipo)}
                  <span className="ml-1">{metricas.clientesNuevos.cambio >= 0 ? '+' : ''}{metricas.clientesNuevos.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ticket Promedio</CardTitle>
                <Package className="h-4 w-4 text-teal-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">
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

            <Card className="bg-white border-green-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Tasa Conversión</CardTitle>
                <TrendingUp className="h-4 w-4 text-rose-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metricas.tasaConversion.valor}%</div>
                <div
                  className={`flex items-center text-xs mt-1 ${getTrendColor(metricas.tasaConversion.tipo)}`}
                >
                  {getTrendIcon(metricas.tasaConversion.tipo)}
                  <span className="ml-1">{metricas.tasaConversion.cambio >= 0 ? '+' : ''}{metricas.tasaConversion.cambio}% vs anterior</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Ventas por{" "}
                  {periodoSeleccionado === "hoy"
                    ? "Hora"
                    : periodoSeleccionado === "semana"
                      ? "Día"
                      : periodoSeleccionado === "mes"
                        ? "Semana"
                        : "Mes"}
                </CardTitle>
                <CardDescription>
                  Rendimiento de ventas en el{" "}
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
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{`${label}`}</p>
                                <p className="text-green-600">{`Ventas: $${payload[0]?.value?.toLocaleString()}`}</p>
                                <p className="text-blue-600">{`Pedidos: ${payload[1]?.value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Bar dataKey="ventas" fill="#10b981" name="Ventas ($)" />
                      <Bar dataKey="pedidos" fill="#3b82f6" name="Pedidos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Tendencia Mensual</CardTitle>
                <CardDescription>Evolución de ventas y clientes por mes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={[...ventasPorMes]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <XAxis dataKey="mes" fontSize={12} tickMargin={10} />
                      <YAxis fontSize={12} tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`} />
                      <ChartTooltip
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{`${label}`}</p>
                                <p className="text-purple-600">{`Ventas: $${payload[0]?.value?.toLocaleString()}`}</p>
                                <p className="text-orange-600">{`Clientes: ${payload[1]?.value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                      <Line type="monotone" dataKey="ventas" stroke="#8b5cf6" strokeWidth={3} name="Ventas ($)" />
                      <Line type="monotone" dataKey="clientes" stroke="#f59e0b" strokeWidth={3} name="Clientes" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Productos Más Vendidos</CardTitle>
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
                            <div className="text-xs text-gray-500">{producto.ventas} unidades vendidas</div>
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
                                backgroundColor: producto.color,
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

            <Card className="bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Ventas por Categoría</CardTitle>
                <CardDescription>Distribución de ventas por tipo de producto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[...categoriaVentas]}
                        dataKey="valor"
                        nameKey="categoria"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ categoria, valor }) => `${categoria}: ${valor}%`}
                        fontSize={12}
                      >
                        {categoriaVentas.map((entry: CategoriaVenta, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
                                <p className="font-medium">{payload[0]?.name}</p>
                                <p className="text-gray-600">{`${payload[0]?.value}% del total`}</p>
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
                    <div className="text-3xl font-bold">{metricas.ventasMes.cambio >= 0 ? '+' : ''}{metricas.ventasMes.cambio}%</div>
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
                      {productosMasVendidos[0]?.ventas || 0} unidades vendidas
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
                    <div className="text-lg font-bold truncate">Cliente</div>
                    <div className="text-sm text-purple-100">$0 en compras</div>
                  </div>
                  <Users className="h-12 w-12 text-purple-200 flex-shrink-0 ml-4" />
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
