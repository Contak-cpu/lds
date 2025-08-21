"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Package, Target, BarChart3 } from "lucide-react"
import type { ProductoFinanciero } from "@/lib/financial-metrics"

interface ProductProfitabilityProps {
  productos: ProductoFinanciero[]
}

export function ProductProfitability({ productos }: ProductProfitabilityProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`
  }

  const getProfitabilityColor = (porcentaje: number) => {
    if (porcentaje >= 70) return "text-green-600 bg-green-50 border-green-200"
    if (porcentaje >= 50) return "text-blue-600 bg-blue-50 border-blue-200"
    if (porcentaje >= 30) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getProfitabilityBadge = (porcentaje: number) => {
    if (porcentaje >= 70) return "Excelente"
    if (porcentaje >= 50) return "Buena"
    if (porcentaje >= 30) return "Regular"
    return "Baja"
  }

  const getProfitabilityIcon = (porcentaje: number) => {
    if (porcentaje >= 50) return <TrendingUp className="h-4 w-4" />
    return <TrendingDown className="h-4 w-4" />
  }

  // Ordenar productos por rentabilidad
  const productosOrdenados = [...productos].sort((a, b) => b.porcentajeMargen - a.porcentajeMargen)

  return (
    <div className="space-y-6">
      {/* Resumen de Rentabilidad */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Margen Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPercentage(productos.reduce((sum, p) => sum + p.porcentajeMargen, 0) / productos.length)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Producto Más Rentable</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold truncate">
              {productosOrdenados[0]?.nombre || "Sin datos"}
            </div>
            <div className="text-sm text-blue-100">
              {formatPercentage(productosOrdenados[0]?.porcentajeMargen || 0)}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Ventas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {productos.reduce((sum, p) => sum + p.ventas, 0)}
            </div>
            <div className="text-sm text-purple-100">unidades</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ganancia Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(productos.reduce((sum, p) => sum + p.gananciaNeta, 0))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabla de Productos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center space-x-2">
            <Package className="h-5 w-5" />
            <span>Análisis de Rentabilidad por Producto</span>
          </CardTitle>
          <CardDescription>
            Comparación de precios de costo vs venta y márgenes de ganancia
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Producto</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Precio Costo</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Precio Venta</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Margen</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ventas</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Ganancia</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Rentabilidad</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {productosOrdenados.map((producto, index) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 flex-shrink-0">
                          <span className="text-sm font-semibold text-gray-600">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {producto.nombre}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm font-medium text-red-600">
                        {formatCurrency(producto.precioCosto)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm font-medium text-green-600">
                        {formatCurrency(producto.precioVenta)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="text-sm font-medium text-blue-600">
                          {formatCurrency(producto.margenGanancia)}
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getProfitabilityColor(producto.porcentajeMargen)}`}
                        >
                          {formatPercentage(producto.porcentajeMargen)}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm text-gray-900">
                        {producto.ventas}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="text-sm font-semibold text-emerald-600">
                        {formatCurrency(producto.gananciaNeta)}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <Badge 
                          variant="outline" 
                          className={`${getProfitabilityColor(producto.porcentajeMargen)} flex items-center space-x-1`}
                        >
                          {getProfitabilityIcon(producto.porcentajeMargen)}
                          <span>{getProfitabilityBadge(producto.porcentajeMargen)}</span>
                        </Badge>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Gráfico de Márgenes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Márgenes por Producto</span>
            </CardTitle>
            <CardDescription>Comparación visual de rentabilidad</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productosOrdenados.map((producto, index) => (
                <div key={producto.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium truncate flex-1 mr-2">{producto.nombre}</span>
                    <span className="text-blue-600 font-semibold">
                      {formatPercentage(producto.porcentajeMargen)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(producto.porcentajeMargen, 100)}%`,
                        backgroundColor: producto.porcentajeMargen >= 70 ? '#22c55e' : 
                                       producto.porcentajeMargen >= 50 ? '#3b82f6' :
                                       producto.porcentajeMargen >= 30 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center space-x-2">
              <Target className="h-5 w-5" />
              <span>Análisis de Costos</span>
            </CardTitle>
            <CardDescription>Distribución de costos vs ganancias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {productosOrdenados.slice(0, 5).map((producto) => (
                <div key={producto.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-gray-900 truncate">
                      {producto.nombre}
                    </div>
                    <div className="text-xs text-gray-500">
                      Costo: {formatCurrency(producto.precioCosto)} | Venta: {formatCurrency(producto.precioVenta)}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-semibold text-green-600">
                      +{formatCurrency(producto.margenGanancia)}
                    </div>
                    <div className="text-xs text-gray-500">
                      por unidad
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Rentabilidad */}
      <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">Resumen de Rentabilidad</CardTitle>
          <CardDescription className="text-gray-600">
            Análisis completo de la rentabilidad del negocio
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {formatPercentage(productos.reduce((sum, p) => sum + p.porcentajeMargen, 0) / productos.length)}
              </div>
              <div className="text-sm text-gray-600">Margen Promedio</div>
              <div className="text-xs text-gray-500 mt-1">
                {productos.filter(p => p.porcentajeMargen >= 50).length} de {productos.length} productos con buena rentabilidad
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(productos.reduce((sum, p) => sum + p.costos, 0))}
              </div>
              <div className="text-sm text-gray-600">Total Costos</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPercentage((productos.reduce((sum, p) => sum + p.costos, 0) / productos.reduce((sum, p) => sum + p.ingresos, 0)) * 100)} de los ingresos
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {formatCurrency(productos.reduce((sum, p) => sum + p.gananciaNeta, 0))}
              </div>
              <div className="text-sm text-gray-600">Ganancia Total</div>
              <div className="text-xs text-gray-500 mt-1">
                {formatPercentage((productos.reduce((sum, p) => sum + p.gananciaNeta, 0) / productos.reduce((sum, p) => sum + p.ingresos, 0)) * 100)} de los ingresos
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
