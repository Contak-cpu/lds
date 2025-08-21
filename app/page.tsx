"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Package, TrendingUp, ShoppingCart, Zap, Sun } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { metricsService, type MetricasDashboard, type ProductoMasVendido } from "@/lib/metrics"
import { DateFilter } from "@/components/ui/date-filter"
import { CurrentDateTime } from "@/components/ui/current-datetime"
import { useDateFilter } from "@/hooks/use-date-filter"

export default function Dashboard() {
  const [metricas, setMetricas] = useState<MetricasDashboard>({
    ventasHoy: 0,
    clientesActivos: 0,
    totalProductos: 0,
    stockTotal: 0,
    pedidosPendientes: 0,
    cambioVentasHoy: 0,
    nuevosClientesSemana: 0,
    productosStockBajo: 0,
    pedidosRequierenAtencion: 0,
  })
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([])
  const [loading, setLoading] = useState(true)
  const dateFilter = useDateFilter("hoy")

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        setLoading(true)
        
        // Obtener el rango de fechas del filtro
        const dateRange = dateFilter.getFilteredDateRange()
        
        const [metricasData, productosData] = await Promise.all([
          metricsService.getMetricasDashboard(
            dateRange?.from, 
            dateRange?.to
          ),
          metricsService.getProductosMasVendidos(
            dateRange?.from, 
            dateRange?.to
          ),
        ])
        setMetricas(metricasData)
        setProductosMasVendidos(productosData)
      } catch (error) {
        console.error("Error cargando métricas:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarMetricas()
  }, [])

  // Recargar datos cuando cambien los filtros de fechas
  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        setLoading(true)
        
        // Obtener el rango de fechas del filtro
        const dateRange = dateFilter.getFilteredDateRange()
        
        const [metricasData, productosData] = await Promise.all([
          metricsService.getMetricasDashboard(
            dateRange?.from, 
            dateRange?.to
          ),
          metricsService.getProductosMasVendidos(
            dateRange?.from, 
            dateRange?.to
          ),
        ])
        setMetricas(metricasData)
        setProductosMasVendidos(productosData)
      } catch (error) {
        console.error("Error cargando métricas:", error)
      } finally {
        setLoading(false)
      }
    }

    cargarMetricas()
  }, [dateFilter.selectedQuickFilter, dateFilter.selectedRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="lg:ml-64 p-4 sm:p-6">
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-2 text-sm text-muted-foreground">Cargando métricas...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-card border-b border-border shadow-sm">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 gap-4 sm:gap-0">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-card-foreground">Dashboard de Ventas</h1>
                <p className="text-sm text-green-600">Gestiona tu tienda de zapatillas deportivas de manera eficiente</p>
                <CurrentDateTime />
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900 dark:text-green-200 dark:border-green-700">
                  Activo
                </Badge>
                <Link href="/configuracion">
                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                    Configuración
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Filtro de fechas */}
        <div className="bg-muted/50 border-b border-border px-4 sm:px-6 py-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Filtrar por período:</h3>
              <DateFilter
                onDateRangeChange={dateFilter.setSelectedRange}
                onQuickFilterChange={dateFilter.setSelectedQuickFilter}
                selectedRange={dateFilter.selectedRange}
                selectedQuickFilter={dateFilter.selectedQuickFilter}
              />
            </div>
            {(() => {
              const range = dateFilter.getFilteredDateRange()
              return range?.from && (
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Período seleccionado:</span>{" "}
                  {range.from.toLocaleDateString("es-AR")}
                  {range.to && ` - ${range.to.toLocaleDateString("es-AR")}`}
                </div>
              )
            })()}
          </div>
        </div>

        {/* Indicador de filtro activo */}
        {(() => {
          const range = dateFilter.getFilteredDateRange()
          if (range?.from) {
            return (
              <div className="bg-green-50 border-b border-green-200 px-4 sm:px-6 py-2">
                <div className="max-w-7xl mx-auto">
                  <p className="text-sm text-green-700">
                    <span className="inline-block w-4 h-4 mr-1">📅</span>
                    Mostrando datos del período: <strong>
                      {dateFilter.selectedQuickFilter === "hoy" ? "Hoy" : 
                       dateFilter.selectedQuickFilter === "ayer" ? "Ayer" :
                       dateFilter.selectedQuickFilter === "semana" ? "Esta Semana" :
                       dateFilter.selectedQuickFilter === "mes" ? "Este Mes" :
                       dateFilter.selectedQuickFilter === "año" ? "Este Año" : 
                       dateFilter.selectedQuickFilter}</strong>
                    {range.from && (
                      <> desde {range.from.toLocaleDateString("es-AR")}
                      {range.to && <> hasta {range.to.toLocaleDateString("es-AR")}</>}</>
                    )}
                  </p>
                </div>
              </div>
            )
          }
          return null
        })()}

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Hoy</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-card-foreground">${metricas.ventasHoy.toLocaleString()} ARS</div>
                <p className={`text-xs mt-1 ${metricas.cambioVentasHoy >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metricas.cambioVentasHoy >= 0 ? '+' : ''}{metricas.cambioVentasHoy.toFixed(1)}% desde ayer
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-card-foreground">{metricas.clientesActivos}</div>
                <p className="text-xs text-blue-600 mt-1">+{metricas.nuevosClientesSemana} nuevos esta semana</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Productos</CardTitle>
                <Package className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-card-foreground">{metricas.totalProductos}</div>
                <p className="text-xs text-amber-600 mt-1">Stock total: {metricas.stockTotal} unidades</p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Pendientes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-xl sm:text-2xl font-bold text-card-foreground">{metricas.pedidosPendientes}</div>
                <p className="text-xs text-purple-600 mt-1">{metricas.pedidosRequierenAtencion} requieren atención</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {/* Quick Actions */}
            <Card className="lg:col-span-1 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-card-foreground">Acciones Rápidas</CardTitle>
                <CardDescription>Gestiona tu negocio eficientemente</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/clientes">
                  <Button className="w-full justify-start bg-green-600 hover:bg-green-700" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Gestionar Clientes
                  </Button>
                </Link>
                <Link href="/productos">
                  <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700" size="sm">
                    <Package className="mr-2 h-4 w-4" />
                    Catálogo de Productos
                  </Button>
                </Link>
                <Link href="/ventas">
                  <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700" size="sm">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Nueva Venta
                  </Button>
                </Link>
                <Link href="/reportes">
                  <Button className="w-full justify-start bg-amber-600 hover:bg-amber-700" size="sm">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Ver Reportes
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-2 bg-card border-border">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-card-foreground">Actividad Reciente</CardTitle>
                <CardDescription>Últimas transacciones y eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metricas.ventasHoy > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="bg-green-600 p-2 rounded-full flex-shrink-0">
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">Ventas del día</p>
                        <p className="text-xs text-muted-foreground">Total: ${metricas.ventasHoy.toLocaleString()} ARS</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">Hoy</span>
                    </div>
                  )}

                  {metricas.nuevosClientesSemana > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <div className="bg-blue-600 p-2 rounded-full flex-shrink-0">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">Nuevos clientes</p>
                        <p className="text-xs text-muted-foreground">{metricas.nuevosClientesSemana} registrados esta semana</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">Esta semana</span>
                    </div>
                  )}

                  {metricas.productosStockBajo > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-amber-50 dark:bg-amber-950 rounded-lg">
                      <div className="bg-amber-600 p-2 rounded-full flex-shrink-0">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-card-foreground">Stock bajo</p>
                        <p className="text-xs text-muted-foreground">{metricas.productosStockBajo} productos requieren reposición</p>
                      </div>
                      <span className="text-xs text-muted-foreground flex-shrink-0">Reciente</span>
                    </div>
                  )}

                  {metricas.ventasHoy === 0 && metricas.nuevosClientesSemana === 0 && metricas.productosStockBajo === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-sm">No hay actividad reciente</p>
                      <p className="text-xs">Comienza creando tu primera venta o cliente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-card-foreground">Productos Más Vendidos</CardTitle>
              <CardDescription>Los favoritos de tus clientes este mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {productosMasVendidos.length > 0 ? (
                  productosMasVendidos.slice(0, 3).map((producto, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="bg-green-600 p-3 rounded-lg flex-shrink-0">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-card-foreground truncate">{producto.nombre}</h4>
                        <p className="text-sm text-muted-foreground">{producto.ventas} ventas - ${producto.ingresos.toLocaleString()} ARS</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-1 md:col-span-3 text-center py-8 text-muted-foreground">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm">No hay productos vendidos aún</p>
                    <p className="text-xs">Las ventas aparecerán aquí</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
