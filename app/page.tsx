"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Package, TrendingUp, ShoppingCart, Leaf, Droplets, Sun } from "lucide-react"
import { Navigation } from "@/components/navigation"
import Link from "next/link"
import { metricsService, type MetricasDashboard, type ProductoMasVendido } from "@/lib/metrics"

export default function Dashboard() {
  const [metricas, setMetricas] = useState<MetricasDashboard>({
    ventasHoy: 0,
    clientesActivos: 0,
    productosEnStock: 0,
    pedidosPendientes: 0,
    cambioVentasHoy: 0,
    nuevosClientesSemana: 0,
    productosStockBajo: 0,
    pedidosRequierenAtencion: 0,
  })
  const [productosMasVendidos, setProductosMasVendidos] = useState<ProductoMasVendido[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarMetricas = async () => {
      try {
        setLoading(true)
        const [metricasData, productosData] = await Promise.all([
          metricsService.getMetricasDashboard(),
          metricsService.getProductosMasVendidos(),
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

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
        <Navigation />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg text-gray-600">Cargando métricas...</div>
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
            <div className="flex justify-between items-center h-16">
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard de Ventas</h1>
                <p className="text-sm text-green-600">Gestiona tu negocio de cultivo de manera eficiente</p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
                  Activo
                </Badge>
                <Link href="/configuracion">
                  <Button variant="outline" size="sm">
                    Configuración
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Ventas Hoy</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">${metricas.ventasHoy.toLocaleString()} ARS</div>
                <p className={`text-xs mt-1 ${metricas.cambioVentasHoy >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {metricas.cambioVentasHoy >= 0 ? '+' : ''}{metricas.cambioVentasHoy.toFixed(1)}% desde ayer
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Clientes Activos</CardTitle>
                <Users className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metricas.clientesActivos}</div>
                <p className="text-xs text-blue-600 mt-1">+{metricas.nuevosClientesSemana} nuevos esta semana</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Productos en Stock</CardTitle>
                <Package className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metricas.productosEnStock}</div>
                <p className="text-xs text-amber-600 mt-1">{metricas.productosStockBajo} productos con stock bajo</p>
              </CardContent>
            </Card>

            <Card className="bg-white border-green-200 hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Pedidos Pendientes</CardTitle>
                <ShoppingCart className="h-4 w-4 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{metricas.pedidosPendientes}</div>
                <p className="text-xs text-purple-600 mt-1">{metricas.pedidosRequierenAtencion} requieren atención</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quick Actions */}
            <Card className="lg:col-span-1 bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Acciones Rápidas</CardTitle>
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
            <Card className="lg:col-span-2 bg-white border-green-200">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">Actividad Reciente</CardTitle>
                <CardDescription>Últimas transacciones y eventos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {metricas.ventasHoy > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="bg-green-600 p-2 rounded-full">
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Ventas del día</p>
                        <p className="text-xs text-gray-500">Total: ${metricas.ventasHoy.toLocaleString()} ARS</p>
                      </div>
                      <span className="text-xs text-gray-400">Hoy</span>
                    </div>
                  )}

                  {metricas.nuevosClientesSemana > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                      <div className="bg-blue-600 p-2 rounded-full">
                        <Users className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Nuevos clientes</p>
                        <p className="text-xs text-gray-500">{metricas.nuevosClientesSemana} registrados esta semana</p>
                      </div>
                      <span className="text-xs text-gray-400">Esta semana</span>
                    </div>
                  )}

                  {metricas.productosStockBajo > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                      <div className="bg-amber-600 p-2 rounded-full">
                        <Package className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">Stock bajo</p>
                        <p className="text-xs text-gray-500">{metricas.productosStockBajo} productos requieren reposición</p>
                      </div>
                      <span className="text-xs text-gray-400">Reciente</span>
                    </div>
                  )}

                  {metricas.ventasHoy === 0 && metricas.nuevosClientesSemana === 0 && metricas.productosStockBajo === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p className="text-sm">No hay actividad reciente</p>
                      <p className="text-xs">Comienza creando tu primera venta o cliente</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card className="mt-6 bg-white border-green-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">Productos Más Vendidos</CardTitle>
              <CardDescription>Los favoritos de tus clientes este mes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {productosMasVendidos.length > 0 ? (
                  productosMasVendidos.slice(0, 3).map((producto, index) => (
                    <div key={index} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <div className="bg-green-600 p-3 rounded-lg">
                        <Leaf className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{producto.nombre}</h4>
                        <p className="text-sm text-gray-600">{producto.ventas} ventas - ${producto.ingresos.toLocaleString()} ARS</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-gray-500">
                    <Package className="h-12 w-12 mx-auto mb-4 text-gray-300" />
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
